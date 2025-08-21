import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/AuthProvider';

interface SearchHistoryItem {
  id: number;
  region: string;
  placeType: string;
  minStars: number;
  searchRadius: number;
  resultsCount: number;
  searchedAt: string;
}

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Fetch search history
  const fetchSearchHistory = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/search-history');
      const data = await response.json();
      
      if (response.ok) {
        setSearchHistory(data.searchHistory);
      } else {
        setError(data.error || 'Failed to fetch search history');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Save search to history
  const saveSearchToHistory = useCallback(async (searchData: {
    region: string;
    placeType: string;
    minStars: number;
    searchRadius: number;
    resultsCount: number;
  }) => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch('/api/search-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      });

      if (response.ok) {
        // Refresh search history
        fetchSearchHistory();
      }
    } catch (err) {
      console.error('Failed to save search history:', err);
    }
  }, [isAuthenticated, fetchSearchHistory]);

  // Clear search history
  const clearSearchHistory = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch('/api/search-history', {
        method: 'DELETE',
      });

      if (response.ok) {
        setSearchHistory([]);
      }
    } catch (err) {
      console.error('Failed to clear search history:', err);
    }
  }, [isAuthenticated]);

  // Load search history when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchSearchHistory();
    } else {
      setSearchHistory([]);
    }
  }, [isAuthenticated, fetchSearchHistory]);

  return {
    searchHistory,
    loading,
    error,
    saveSearchToHistory,
    clearSearchHistory,
    refreshHistory: fetchSearchHistory,
  };
}