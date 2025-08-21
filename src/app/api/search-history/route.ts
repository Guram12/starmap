import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// GET - Fetch user's search history
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    
    const searchHistory = await prisma.searchHistory.findMany({
      where: { userId: decoded.userId },
      orderBy: { searchedAt: 'desc' },
      take: 50, // Limit to last 50 searches
    });

    return NextResponse.json({ searchHistory });
  } catch (error) {
    console.error('Error fetching search history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Save new search to history
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    const body = await request.json();
    
    const { region, placeType, minStars, searchRadius, resultsCount } = body;

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
      // Update results count of recent search instead of creating duplicate
      const updatedSearch = await prisma.searchHistory.update({
        where: { id: recentSearch.id },
        data: { 
          resultsCount,
          searchedAt: new Date() // Update timestamp
        }
      });
      return NextResponse.json({ searchHistory: updatedSearch });
    }

    // Create new search history record
    const searchHistory = await prisma.searchHistory.create({
      data: {
        userId: decoded.userId,
        region,
        placeType,
        minStars,
        searchRadius,
        resultsCount,
      }
    });

    return NextResponse.json({ searchHistory });
  } catch (error) {
    console.error('Error saving search history:', error);
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