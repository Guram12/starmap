import { useState, useCallback } from 'react';
import { majorCities } from '@/lib/major_cityes';



interface Place {
  id: string;
  displayName: string;
  rating?: number | null;
  formattedAddress?: string | null;
  location: google.maps.LatLng;
  photos?: google.maps.places.Photo[];
  types?: string[];
  priceLevel?: google.maps.places.PriceLevel | null;
  websiteURI?: string | null;
  nationalPhoneNumber?: string | null;
}

interface SearchParams {
  location: google.maps.LatLng;
  radius: number;
  type: string;
  minRating?: number;
}

export function usePlacesSearch() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMajorCity = useCallback((locationName: string): boolean => {
    const normalizedLocation = locationName.toLowerCase().trim();
    return majorCities.some(city =>
      normalizedLocation.includes(city.toLowerCase()) ||
      city.toLowerCase().includes(normalizedLocation)
    );
  }, []);

  const getOptimalRadius = useCallback((locationName: string, requestedRadius: number): number => {
    // Cap at 20km max
    const maxRadius = 20;
    const cityMaxRadius = 5;

    if (isMajorCity(locationName)) {
      return Math.min(requestedRadius, cityMaxRadius);
    }

    return Math.min(requestedRadius, maxRadius);
  }, [isMajorCity]);



  const searchPlaces = useCallback(async (
    map: google.maps.Map,
    params: SearchParams,
    locationName?: string
  ) => {
    if (!map) return;

    setLoading(true);
    setError(null);

    try {
      const { Place } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;

      // Get optimal radius based on location
      const optimalRadius = locationName ?
        getOptimalRadius(locationName, params.radius) :
        Math.min(params.radius, 20);

      const request = {
        fields: [
          'id',
          'displayName',
          'location',
          'rating',
          'formattedAddress',
          'photos',
          'types',
          'priceLevel',
          'websiteURI',
          'nationalPhoneNumber'
        ],
        locationRestriction: {
          center: params.location,
          radius: optimalRadius * 1000, // Convert km to meters
        },
        includedTypes: [params.type],
        maxResultCount: 20,
        rankPreference: 'DISTANCE' as any,
        language: 'en-US',
        region: 'us',
      };

      console.log(`Searching with radius: ${optimalRadius}km for location: ${locationName || 'Unknown'}`);

      const { places: results } = await Place.searchNearby(request);

      if (results && results.length > 0) {
        let filteredResults = results;
        if (params.minRating) {
          filteredResults = results.filter(
            place => place.rating && place.rating >= params.minRating!
          );
        }

        const transformedPlaces: Place[] = filteredResults.map(place => ({
          id: place.id!,
          displayName: place.displayName || 'Unknown',
          rating: place.rating || null,
          formattedAddress: place.formattedAddress || null,
          location: place.location!,
          photos: place.photos,
          types: place.types,
          priceLevel: place.priceLevel || null,
          websiteURI: place.websiteURI || null,
          nationalPhoneNumber: place.nationalPhoneNumber || null,
        }));

        setPlaces(transformedPlaces);
      } else {
        setPlaces([]);
        setError('No places found');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [getOptimalRadius]);

  const geocodeLocation = useCallback(async (locationName: string): Promise<google.maps.LatLng | null> => {
    return new Promise((resolve) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: locationName }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          resolve(results[0].geometry.location);
        } else {
          resolve(null);
        }
      });
    });
  }, []);

  return { places, loading, error, searchPlaces, geocodeLocation, isMajorCity, getOptimalRadius };
}