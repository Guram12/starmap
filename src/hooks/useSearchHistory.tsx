import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/AuthProvider';

interface SearchPlace {
  id: number;
  placeId: string;
  displayName: string;
  rating: number | null;
  formattedAddress: string | null;
  latitude: number;
  longitude: number;
  types: string | null;
  priceLevel: number | null;
  websiteURI: string | null;
  phoneNumber: string | null;
  photoUrl: string | null;

}

interface SearchHistoryItem {
  id: number;
  region: string;
  placeType: string;
  minStars: number;
  searchRadius: number;
  resultsCount: number;
  searchedAt: string;
  places: SearchPlace[];
}

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

interface SearchParams {
  region: string;
  placeType: string;
  minStars: number;
  searchRadius: number;
  resultsCount: number;
  places?: PlaceData[]; // Replace any[] with PlaceData[]
}

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Fetch search history
  const fetchSearchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/search-history');

      if (!response.ok) {
        if (response.status === 401) {
          // User not authenticated, return empty array
          setSearchHistory([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSearchHistory(data.searchHistory || []);
    } catch (err) {
      console.error('Error fetching search history:', err);
      setError('Failed to load search history');
      setSearchHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save search to history
  const saveSearchToHistory = useCallback(async (searchParams: SearchParams) => {
    console.log('💾 HOOK: Attempting to save search to history:', {
      region: searchParams.region,
      placesCount: searchParams.places?.length || 0,
      hasPlaces: !!searchParams.places
    });

    try {
      const response = await fetch('/api/search-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.message && result.message.includes('Not authenticated')) {
          console.log('👤 HOOK: User not authenticated - skipping database save');
          return;
        }
        console.log('✅ HOOK: Search saved successfully');
        // Refresh history after saving
        await fetchSearchHistory();
      } else {
        console.error('❌ HOOK: Failed to save search');
      }
    } catch (err) {
      console.error('❌ HOOK: Error saving search to history:', err);
    }
  }, [fetchSearchHistory]);

  // Clear search history
  const clearSearchHistory = useCallback(async () => {
    try {
      const response = await fetch('/api/search-history', {
        method: 'DELETE',
      });

      if (response.ok) {
        setSearchHistory([]);
      }
    } catch (err) {
      console.error('Error clearing search history:', err);
      setError('Failed to clear search history');
    }
  }, []);

  // Load search history on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchSearchHistory();
    }
  }, [fetchSearchHistory, isAuthenticated]);

  return {
    searchHistory,
    loading,
    error,
    saveSearchToHistory,
    clearSearchHistory,
    fetchSearchHistory,
  };
}