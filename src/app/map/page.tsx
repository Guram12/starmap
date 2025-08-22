'use client';

import { useState, useEffect } from 'react';
import { useGoogleMap } from '../../hooks/useGoogleMap';
import { usePlacesSearch } from '../../hooks/usePlacesSearch';
import styles from './Map.module.css';
import { MapPinned } from 'lucide-react';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useAuth } from '../AuthProvider';


interface Preferences {
  region: string;
  placeType: string;
  minStars: number;
  searchRadius: number;
}

export default function MapPage() {
  const [preferences, setPreferences] = useState<Preferences>({
    region: '',
    placeType: 'restaurant',
    minStars: 3,
    searchRadius: 5
  });
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [lastSearchTime, setLastSearchTime] = useState(0);
  const MIN_SEARCH_INTERVAL = 3000; // 3 seconds between searches

  const { mapRef, map, isLoaded, error: mapError } = useGoogleMap();

  const { places, loading, error: searchError, searchPlaces, geocodeLocation } = usePlacesSearch();

  const { saveSearchToHistory } = useSearchHistory();
  const { isAuthenticated } = useAuth();




  //=====================================    Load places when map and preferences are ready     ====================================
  useEffect(() => {
    console.log('Places updated:', places);
  }, [places]);


  //=====================================    Load preferences from localStorage     ==================================== 
  useEffect(() => {
    const savedPrefs = localStorage.getItem('starmap-preferences');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setPreferences({
        region: prefs.region || '',
        placeType: prefs.placeType || 'restaurant',
        minStars: prefs.minStars || 3,
        searchRadius: prefs.searchRadius || 5
      });
    }
    setPrefsLoaded(true);
  }, []);

  //============================ Search for places when map loads and preferences are available  =======================
  useEffect(() => {
    const performSearch = async () => {
      console.log('🚀 MAP PAGE: Starting search process');
      console.log('📋 MAP PAGE: Conditions check:', {
        hasMap: !!map,
        hasRegion: !!preferences.region,
        isLoaded,
        prefsLoaded,
        timestamp: new Date().toISOString()
      });

      if (!map || !preferences.region || !isLoaded) {
        console.log('❌ MAP PAGE: Search cancelled - missing requirements');
        return;
      }

      // Rate limiting
      const now = Date.now();
      if (now - lastSearchTime < MIN_SEARCH_INTERVAL) {
        console.log('🛑 MAP PAGE: Search rate limited - no API calls');
        return;
      }

      console.log('▶️ MAP PAGE: Proceeding with search');

      try {
        console.log('🗺️ MAP PAGE: Calling geocodeLocation');
        const location = await geocodeLocation(preferences.region);

        if (location) {
          console.log('✅ MAP PAGE: Location found, centering map');
          map.setCenter(location);
          map.setZoom(12);

          setLastSearchTime(now);

          console.log('🔍 MAP PAGE: Calling searchPlaces');
          await searchPlaces(map, {
            location,
            radius: preferences.searchRadius,
            type: preferences.placeType,
            minRating: preferences.minStars
          }, preferences.region);

          console.log('✅ MAP PAGE: Search process completed');
        } else {
          console.log('❌ MAP PAGE: No location found');
        }
      } catch (error) {
        console.error('❌ MAP PAGE: Search failed:', error);
      }
    };

    if (prefsLoaded && preferences.region) {
      performSearch();
    }
  }, [map, isLoaded, preferences, prefsLoaded, searchPlaces, geocodeLocation, lastSearchTime]);

  useEffect(() => {
    if (isAuthenticated && places.length > 0 && preferences.region) {
      saveSearchToHistory({
        region: preferences.region,
        placeType: preferences.placeType,
        minStars: preferences.minStars,
        searchRadius: preferences.searchRadius,
        resultsCount: places.length,
      });
    }
  }, [places, preferences, isAuthenticated, saveSearchToHistory]);


  // =========================================  Update markers when places change  =============================================
  useEffect(() => {
    if (!map || !places.length) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    // Create new markers using legacy Marker API (cheaper)
    const newMarkers = places.map(place => {
      const marker = new google.maps.Marker({
        map,
        position: place.location,
        title: place.displayName,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
            `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#1f2937"/>
              <text x="12" y="16" text-anchor="middle" fill="white" font-size="12">${getMarkerIcon(preferences.placeType)}</text>
            </svg>`
          )}`,
          scaledSize: new google.maps.Size(32, 32),
        }
      });

      // Add info window with minimal content
      const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(place)
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      return marker;
    });

    setMarkers(newMarkers);
  }, [map, places, preferences.placeType]);


  // ==============================================    set marker icon   ==================================================


  const getMarkerIcon = (placeType: string): string => {
    const icons: Record<string, string> = {
      restaurant: '🍽️',
      lodging: '🏨',
      tourist_attraction: '🏛️',
      shopping_mall: '🛍️',
      hospital: '🏥'
    };
    return icons[placeType] || '📍';
  };

  // ========================================    Create info window content   ==================================================   

  const createInfoWindowContent = (place: {
    displayName: string;
    rating?: number | null;
    formattedAddress?: string | null;
  }): string => {
    // Simplified info window - no photos or expensive data
    return `
      <div style="max-width: 200px; padding: 8px;">
        <h3 style="margin: 0 0 4px 0; font-size: 14px; color: #1f2937;">${place.displayName}</h3>
        <div style="display: flex; align-items: center; margin-bottom: 4px;">
          <span style="color: #fbbf24; margin-right: 4px;">⭐</span>
          <span style="font-weight: 600; color: #374151;">${place.rating || 'N/A'}</span>
        </div>
        <p style="margin: 0; color: #6b7280; font-size: 12px;">${place.formattedAddress || 'Address not available'}</p>
      </div>
    `;
  };


  // =====================================================================================================================
  if (!prefsLoaded) {
    return (
      <div className={styles.loadingSpinner}>
        <div className={styles.spinner}></div>
        Loading preferences...
      </div>
    );
  }

  return (
    <div className={styles.mapPage}>
      <div className={styles.container}>

        <div className={styles.content}>

          <div className={styles.sidebar}>
            {/* Your existing sidebar content */}
            <div className={styles.settingsCard}>
              <h3 className={styles.cardTitle}>⚙️ Current Settings</h3>
              <div className={styles.settingItem}>
                <span className={styles.settingLabel}>📍 Region:</span>
                <span className={styles.settingValue}>{preferences.region || 'Not set'}</span>
              </div>
              <div className={styles.settingItem}>
                <span className={styles.settingLabel}>🛍️ Place Type:</span>
                <span className={styles.settingValue}>{preferences.placeType}</span>
              </div>
              <div className={styles.settingItem}>
                <span className={styles.settingLabel}>⭐ Min Stars:</span>
                <span className={styles.settingValue}>{preferences.minStars}</span>
              </div>
              <div className={styles.settingItem}>
                <span className={styles.settingLabel}>🎯 Search Radius:</span>
                <span className={styles.settingValue}>{preferences.searchRadius} km</span>
              </div>

            </div>

            <div >
              <h3 className={styles.result_cardTitle}>📍 Results ({places.length})</h3>

              {loading && <p>Searching places...</p>}
              {searchError && <p style={{ color: 'red' }}>{searchError}</p>}
              {places.length > 0 && (
                <div className={styles.placesList}>
                  {places.map((place) => (
                    <div key={place.id} className={styles.placeItem}>
                      <div className={styles.placeName}>{place.displayName}</div>
                      <div className={styles.placeRating}>⭐ {place.rating || 'N/A'}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>


          </div>

          <div className={styles.mapContainer}>
            <div className={styles.mapHeader}>
              <h3 className={styles.mapTitle}>
                <MapPinned className={styles.mapIcon} /> Interactive Map
              </h3>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                {preferences.region ? `Searching in ${preferences.region}` : 'Set region to search'}
              </span>
            </div>

            {mapError ? (
              <div className={styles.errorMessage}>
                <p>❌ Error loading map: {mapError}</p>
              </div>
            ) : (
              <>
                <div
                  ref={mapRef}
                  className={styles.mapDiv}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '12px',
                    backgroundColor: '#20499B'
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}