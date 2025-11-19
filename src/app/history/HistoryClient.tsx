'use client';

import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useAuth } from '../AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './History.module.css';
import { motion } from 'framer-motion';


export default function HistoryClient() {
  const { isAuthenticated } = useAuth();
  const { searchHistory, loading, clearSearchHistory } = useSearchHistory();
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getPlaceTypeIcon = (placeType: string) => {
    const icons: Record<string, string> = {
      restaurant: '🍽️',
      lodging: '🏨',
      tourist_attraction: '🏛️',
      shopping_mall: '🛍️',
      hospital: '🏥',
    };
    return icons[placeType] || '📍';
  };

  const handleSelectSearch = (search: typeof searchHistory[0]) => {

    // Save selected search preferences
    const preferences = {
      region: search.region,
      placeType: search.placeType,
      minStars: search.minStars,
      searchRadius: search.searchRadius,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('starmap-preferences', JSON.stringify(preferences));

    // Convert database places back to the format expected by map
    const placesForMap = search.places.map(place => ({
      id: place.placeId,
      displayName: place.displayName,
      rating: place.rating,
      formattedAddress: place.formattedAddress,
      location: {
        lat: place.latitude,
        lng: place.longitude
      },
      types: place.types ? JSON.parse(place.types) : undefined,
      priceLevel: place.priceLevel,
      websiteURI: place.websiteURI,
      nationalPhoneNumber: place.phoneNumber,
      photoUrl: place.photoUrl

    }));

    // Save search results from history
    const searchResults = {
      places: placesForMap,
      searchParams: {
        region: search.region,
        placeType: search.placeType,
        minStars: search.minStars,
        searchRadius: search.searchRadius
      },
      timestamp: search.searchedAt,
      fromHistory: true // This is crucial - marks it as from history
    };

    localStorage.setItem('starmap-search-results', JSON.stringify(searchResults));
    console.log('✅ HISTORY: Search results saved to localStorage:', {
      places: placesForMap.length,
      fromHistory: true
    });

    // Clear any existing results first to force refresh
    localStorage.removeItem('starmap-search-results');
    setTimeout(() => {
      localStorage.setItem('starmap-search-results', JSON.stringify(searchResults));
      router.push('/map');
    }, 50);
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all search history? This action cannot be undone.')) {
      await clearSearchHistory();
    }
  };

  // =================================   Calculate stats    ====================================
  const totalSearches = searchHistory.length;
  const uniqueRegions = new Set(searchHistory.map(item => item.region)).size;
  const totalResults = searchHistory.reduce((sum, item) => sum + item.resultsCount, 0);
  const averageResults = totalSearches > 0 ? Math.round(totalResults / totalSearches) : 0;



  if (!isAuthenticated) {
    return (
      <motion.div 
        className={styles.historyPage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.container}>
          <motion.div 
            className={styles.header}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <h1 className={styles.title}>
              📊 Search History
            </h1>
            <p className={styles.subtitle}>
              View and revisit your previous searches
            </p>
          </motion.div>

          <motion.div 
            className={styles.searchHistory}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className={styles.notLoggedIn}>
              <div className={styles.authIcon}>🔐</div>
              <h3>Authentication Required</h3>
              <p>Please log in or register to view your search history</p>
              <Link href="/auth" className={styles.authLink}>
                Go to Login / Register
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }


  return (
    <motion.div 
      className={styles.historyPage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
        >
          <h1 className={styles.title}>
            📊 Search History
          </h1>
          <p className={styles.subtitle}>
            View and revisit your previous searches
          </p>
        </motion.div>

        <motion.div 
          className={styles.actions}
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.25 }}
        >
          <Link href="/preferences" className={`${styles.actionBtn} ${styles.preferencesBtn}`}>
            ⚙️ Preferences
          </Link>
          {searchHistory.length > 0 && (
            <motion.button
              onClick={handleClearHistory}
              className={`${styles.actionBtn} ${styles.clearBtn}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🗑️ Clear History
            </motion.button>
          )}
        </motion.div>

        {!isAuthenticated ? (
          <motion.div 
            className={styles.searchHistory}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className={styles.notLoggedIn}>
              <p>🔐 Please log in to view search history</p>
            </div>
          </motion.div>
        ) : loading ? (
          <motion.div 
            className={styles.searchHistory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.25 }}
          >
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading search history...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className={styles.searchHistory}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {searchHistory.length > 0 && (
              <>
                <motion.div 
                  className={styles.statsSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.25 }}
                >
                  <motion.div 
                    className={styles.stats}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.3 }}
                  >
                    <motion.div 
                      className={styles.statItem}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, duration: 0.2 }}
                    >
                      <span className={styles.statValue}>{totalSearches}</span>
                      <span className={styles.statLabel}>Total Searches</span>
                    </motion.div>
                    <motion.div 
                      className={styles.statItem}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.45, duration: 0.2 }}
                    >
                      <span className={styles.statValue}>{uniqueRegions}</span>
                      <span className={styles.statLabel}>Unique Regions</span>
                    </motion.div>
                    <motion.div 
                      className={styles.statItem}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.2 }}
                    >
                      <span className={styles.statValue}>{totalResults}</span>
                      <span className={styles.statLabel}>Total Results</span>
                    </motion.div>
                    <motion.div 
                      className={styles.statItem}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.55, duration: 0.2 }}
                    >
                      <span className={styles.statValue}>{averageResults}</span>
                      <span className={styles.statLabel}>Avg per Search</span>
                    </motion.div>
                  </motion.div>
                </motion.div>

              </>
            )}

            {searchHistory.length === 0 ? (
              <motion.div 
                className={styles.empty}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <p>🔍 No search history yet</p>
                <p>Start exploring places to see your searches here!</p>
              </motion.div>
            ) : (
              <motion.div 
                className={styles.historyList}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                {searchHistory.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    className={styles.historyItem}
                    onClick={() => handleSelectSearch(item)}
                    title="Click to use these settings and go to map"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: 0.65 + (idx * 0.03), 
                      duration: 0.25 
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      x: 5
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={styles.searchInfo}>
                      <div className={styles.mainInfo}>
                        <span className={styles.region}>
                          📍 {item.region}
                        </span>
                        <span className={styles.placeType}>
                          {getPlaceTypeIcon(item.placeType)} {item.placeType.replace('_', ' ')}
                        </span>
                      </div>
                      <div className={styles.details}>
                        <span>⭐ {item.minStars}+ stars</span>
                        <span>🎯 {item.searchRadius}km radius</span>
                        <span>📊 {item.resultsCount} results</span>
                      </div>
                    </div>
                    <div className={styles.timestamp}>
                      {formatDate(item.searchedAt)}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}