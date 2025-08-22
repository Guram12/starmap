

import { useState, useCallback, useRef } from 'react';
import { useEffect } from 'react';


interface Place {
  id: string;
  displayName: string;
  rating?: number | null;
  formattedAddress?: string | null;
  location: google.maps.LatLng;
  photos?: google.maps.places.PlacePhoto[];
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

  // Add caching and debouncing
  const cache = useRef(new Map<string, { data: Place[], timestamp: number }>());
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSearchRef = useRef<string>('');
  const geocodingCache = useRef(new Map<string, { location: google.maps.LatLng, timestamp: number }>());

  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  const DEBOUNCE_DELAY = 1000; // 1 second
  const MAX_RESULTS = 15; // Fixed limit for all searches


  // Suppress Google Maps deprecation warnings for cost optimization
  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = function(message, ...args) {
      // Suppress specific Google Maps deprecation warnings
      if (typeof message === 'string' && (
        message.includes('google.maps.places.PlacesService is not available') ||
        message.includes('google.maps.Marker is deprecated') ||
        message.includes('PlacesService') ||
        message.includes('AdvancedMarkerElement')
      )) {
        return; // Suppress these warnings
      }
      // Allow other warnings to show
      originalWarn.apply(console, [message, ...args]);
    };

    // Cleanup function to restore original console.warn when component unmounts
    return () => {
      console.warn = originalWarn;
    };
  }, []);

  const searchPlaces = useCallback(async (
    map: google.maps.Map,
    params: SearchParams,
    locationName?: string
  ) => {
    if (!map) return;

    // Create cache key
    const cacheKey = `${params.location.lat()}-${params.location.lng()}-${params.radius}-${params.type}-${params.minRating || 0}`;

    console.log('🔍 PLACES SEARCH REQUEST:', {
      locationName,
      cacheKey,
      timestamp: new Date().toISOString()
    });

    // Check cache first
    const cached = cache.current.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('✅ USING CACHED RESULTS - NO API CALL');
      setPlaces(cached.data);
      return;
    }

    // Prevent duplicate requests
    if (lastSearchRef.current === cacheKey) {
      console.log('🚫 DUPLICATE REQUEST PREVENTED - NO API CALL');
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce the search
    searchTimeoutRef.current = setTimeout(async () => {
      lastSearchRef.current = cacheKey;
      setLoading(true);
      setError(null);

      console.log('🌐 MAKING GOOGLE PLACES API CALL:', {
        location: `${params.location.lat()}, ${params.location.lng()}`,
        radius: params.radius,
        type: params.type,
        minRating: params.minRating,
        timestamp: new Date().toISOString()
      });


      try {
        const service = new google.maps.places.PlacesService(map);

        // Use a fixed smaller radius to reduce costs
        const optimizedRadius = Math.min(params.radius, 10); // Max 10km for all searches

        const request: google.maps.places.PlaceSearchRequest = {
          location: params.location,
          radius: optimizedRadius * 1000,
          type: params.type,
        };

        console.log(`Searching with radius: ${optimizedRadius}km for location: ${locationName || 'Unknown'}`);
        console.log(`Limited to ${MAX_RESULTS} results to reduce API costs`);

        const results = await new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
          service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              resolve(results.slice(0, MAX_RESULTS)); // Always limit to 15 results
            } else {
              reject(new Error(`Search failed: ${status}`));
            }
          });
        });

        if (results && results.length > 0) {
          let filteredResults = results;
          if (params.minRating) {
            filteredResults = results.filter(
              place => place.rating && place.rating >= params.minRating!
            );
          }

          const transformedPlaces: Place[] = filteredResults.map(place => ({
            id: place.place_id!,
            displayName: place.name || 'Unknown',
            rating: place.rating || null,
            formattedAddress: place.formatted_address || null,
            location: place.geometry!.location!,
            photos: place.photos || undefined,
            types: place.types,
            priceLevel: place.price_level !== undefined ? (place.price_level as unknown as google.maps.places.PriceLevel) : null,
            websiteURI: null,
            nationalPhoneNumber: null,
          }));

          // Cache the results
          cache.current.set(cacheKey, {
            data: transformedPlaces,
            timestamp: Date.now()
          });

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
        lastSearchRef.current = '';
      }
    }, DEBOUNCE_DELAY);

  }, []);










  const geocodeLocation = useCallback(async (locationName: string): Promise<google.maps.LatLng | null> => {
    console.log('🗺️ GEOCODING REQUEST:', { locationName, timestamp: new Date().toISOString() });

    // Check if input is already coordinates
    const coordPattern = /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/;
    const coordMatch = locationName.trim().match(coordPattern);

    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);

      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        console.log('✅ USING DIRECT COORDINATES - NO API CALL:', { lat, lng });
        return new google.maps.LatLng(lat, lng);
      }
    }

    // Check cache first for text-based locations
    const normalizedName = locationName.toLowerCase().trim();
    const cached = geocodingCache.current.get(normalizedName);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('✅ USING CACHED GEOCODING - NO API CALL');
      return cached.location;
    }

    console.log('🌐 MAKING GOOGLE GEOCODING API CALL:', { locationName, timestamp: new Date().toISOString() });

    // Use geocoding service for city/address names
    return new Promise((resolve) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: locationName }, (results, status) => {
        console.log('📡 GOOGLE GEOCODING API RESPONSE:', {
          status,
          hasResults: !!(results && results[0]),
          timestamp: new Date().toISOString()
        });

        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;

          // Cache the result
          geocodingCache.current.set(normalizedName, {
            location,
            timestamp: Date.now()
          });

          console.log('✅ GEOCODING COMPLETED AND CACHED');
          resolve(location);
        } else {
          console.log('❌ GEOCODING FAILED:', status);
          resolve(null);
        }
      });
    });
  }, []);

  return { places, loading, error, searchPlaces, geocodeLocation };
}