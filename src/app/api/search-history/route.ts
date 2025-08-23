import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface PlaceData {
  id: string;
  displayName: string;
  rating: number | null | undefined;
  formattedAddress: string | null | undefined;
  location: {
    lat: number;
    lng: number;
  };
  types?: string[];
  priceLevel: number | null | undefined;
  websiteURI: string | null | undefined;
  nationalPhoneNumber: string | null | undefined;
}

// GET - Fetch user's search history with places
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    
    const searchHistory = await prisma.searchHistory.findMany({
      where: { userId: decoded.userId },
      include: {
        places: true // Include related places
      },
      orderBy: { searchedAt: 'desc' },
      take: 50, // Limit to last 50 searches
    });

    return NextResponse.json({ searchHistory });
  } catch (error) {
    console.error('Error fetching search history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Save new search to history with places data
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      // Return early for unauthenticated users - don't process the request
      return NextResponse.json({ message: 'Not authenticated - skipping database save' }, { status: 200 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    const body = await request.json();
    
    const { region, placeType, minStars, searchRadius, resultsCount, places } = body;

    console.log('📝 SAVING SEARCH HISTORY:', {
      userId: decoded.userId,
      region,
      placeType,
      placesCount: places?.length || 0,
      hasPlaces: !!places
    });

    // Check if exact same search exists within last 5 minutes (avoid duplicates)
    const recentSearch = await prisma.searchHistory.findFirst({
      where: {
        userId: decoded.userId,
        region,
        placeType,
        minStars,
        searchRadius,
        searchedAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
        }
      }
    });

    if (recentSearch) {
      // Update recent search with new places data
      await prisma.searchPlace.deleteMany({
        where: { searchHistoryId: recentSearch.id }
      });

      // Add new places
      if (places && places.length > 0) {
        console.log('📍 UPDATING PLACES FOR EXISTING SEARCH:', places.length);
        await prisma.searchPlace.createMany({
          data: (places as PlaceData[]).map((place: PlaceData) => ({
            searchHistoryId: recentSearch.id,
            placeId: place.id,
            displayName: place.displayName,
            rating: place.rating ?? null,
            formattedAddress: place.formattedAddress ?? null,
            latitude: place.location.lat,
            longitude: place.location.lng,
            types: place.types ? JSON.stringify(place.types) : null,
            priceLevel: place.priceLevel ?? null,
            websiteURI: place.websiteURI ?? null,
            phoneNumber: place.nationalPhoneNumber ?? null,
          }))
        });
      }

      const updatedSearch = await prisma.searchHistory.update({
        where: { id: recentSearch.id },
        data: { 
          resultsCount,
          searchedAt: new Date()
        },
        include: { places: true }
      });

      console.log('✅ UPDATED EXISTING SEARCH WITH PLACES:', updatedSearch.places.length);
      return NextResponse.json({ searchHistory: updatedSearch });
    }

    // Create new search history record with places
    console.log('📍 CREATING NEW SEARCH WITH PLACES:', places?.length || 0);
    const searchHistory = await prisma.searchHistory.create({
      data: {
        userId: decoded.userId,
        region,
        placeType,
        minStars,
        searchRadius,
        resultsCount,
        places: {
          create: places ? (places as PlaceData[]).map((place: PlaceData) => ({
            placeId: place.id,
            displayName: place.displayName,
            rating: place.rating ?? null,
            formattedAddress: place.formattedAddress ?? null,
            latitude: place.location.lat,
            longitude: place.location.lng,
            types: place.types ? JSON.stringify(place.types) : null,
            priceLevel: place.priceLevel ?? null,
            websiteURI: place.websiteURI ?? null,
            phoneNumber: place.nationalPhoneNumber ?? null,
          })) : []
        }
      },
      include: { places: true }
    });

    console.log('✅ CREATED NEW SEARCH HISTORY WITH PLACES:', searchHistory.places.length);
    return NextResponse.json({ searchHistory });
  } catch (error) {
    console.error('❌ ERROR SAVING SEARCH HISTORY:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Clear user's search history
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    
    await prisma.searchHistory.deleteMany({
      where: { userId: decoded.userId }
    });

    return NextResponse.json({ message: 'Search history cleared' });
  } catch (error) {
    console.error('Error clearing search history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}