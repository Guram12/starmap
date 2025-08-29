'use client';

import { useState, useEffect } from 'react';
import { useGoogleMap } from '../../hooks/useGoogleMap';
import styles from './Map.module.css';
import { MapPinned } from 'lucide-react';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useAuth } from '../AuthProvider';


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
  const [places, setPlaces] = useState<Place[]>([]);
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [isFromHistory, setIsFromHistory] = useState(false);

  const { mapRef, map, isLoaded, error: mapError } = useGoogleMap();
  const { saveSearchToHistory } = useSearchHistory();
  const { isAuthenticated } = useAuth();


  //=====================================    Load preferences and search results from localStorage     ====================================
  useEffect(() => {
    // Load preferences
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

  // Separate effect for loading search results after Google Maps is loaded
  useEffect(() => {
    if (!isLoaded || !window.google) return;

    // Load search results only after Google Maps is loaded
    const savedResults = localStorage.getItem('starmap-search-results');
    if (savedResults) {
      const results = JSON.parse(savedResults);
      setIsFromHistory(!!results.fromHistory);

      // Convert plain objects back to LatLng objects - now safe to use
      const placesWithLatLng = results.places.map((place: {
        id: string;
        displayName: string;
        rating?: number | null;
        formattedAddress?: string | null;
        location: { lat: number; lng: number };
        types?: string[];
        priceLevel?: number | null;
        websiteURI?: string | null;
        nationalPhoneNumber?: string | null;
      }) => ({
        ...place,
        location: new google.maps.LatLng(place.location.lat, place.location.lng)
      }));
      setPlaces(placesWithLatLng);
      console.log('✅ MAP PAGE: Loaded search results from localStorage:', {
        count: placesWithLatLng.length,
        fromHistory: !!results.fromHistory,
        timestamp: results.timestamp
      });
    }
  }, [isLoaded]); // Only run when Google Maps is loaded

  // ============================ Center map when preferences load and places are available  =======================
  useEffect(() => {
    if (map && isLoaded && preferences.region && places.length > 0) {
      // Center map on first place or use geocoding for region
      const firstPlace = places[0];
      if (firstPlace && firstPlace.location) {
        map.setCenter(firstPlace.location);
        map.setZoom(12);
        console.log('✅ MAP PAGE: Map centered on search results');
      }
    }
  }, [map, isLoaded, preferences.region, places]);

  // Save to history only for fresh searches, not when loading from history
  useEffect(() => {
    // Only save to database if authenticated AND we have places AND it's not from history
    if (isAuthenticated && places.length > 0 && preferences.region && !isFromHistory) {
      console.log('💾 MAP PAGE: Saving fresh search to history with places');
      saveSearchToHistory({
        region: preferences.region,
        placeType: preferences.placeType,
        minStars: preferences.minStars,
        searchRadius: preferences.searchRadius,
        resultsCount: places.length,
        places: places.map(place => ({
          id: place.id,
          displayName: place.displayName,
          rating: place.rating ?? null,
          formattedAddress: place.formattedAddress ?? null,
          location: {
            lat: place.location.lat(),
            lng: place.location.lng()
          },
          types: place.types,
          priceLevel: place.priceLevel ? Number(place.priceLevel) : null,
          websiteURI: place.websiteURI ?? null,
          nationalPhoneNumber: place.nationalPhoneNumber ?? null,
        }))
      });
    } else if (isFromHistory) {
      console.log('📂 MAP PAGE: Skipping history save - results are from history');
    } else if (!isAuthenticated) {
      console.log('👤 MAP PAGE: Skipping database save - user not authenticated');
    }
  }, [places, preferences, isAuthenticated, saveSearchToHistory, isFromHistory]);


  // =========================================  Update markers when places change  =============================================
  useEffect(() => {
    if (!map || !places.length) {
      // Clear existing markers if no places
      markers.forEach(marker => marker.setMap(null));
      setMarkers([]);
      return;
    }

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

    // Cleanup function to remove markers when component unmounts or places change
    return () => {
      newMarkers.forEach(marker => marker.setMap(null));
    };
  }, [map, places, preferences.placeType]); // Remove 'markers' from dependencies to prevent infinite loop


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

  if (preferences.region === '') {
    return (
      <div className={styles.no_region_container}>
        <div className={styles.no_region_errorMessage}>
          <p>⚠️ No region set. Please go to Preferences to set your search criteria.</p>
        </div>

        <button className={styles.setregion_button}>
          <a href="/preferences?f=region" className={styles.actionBtn}>
            ⚙️ Go to Preferences
          </a>
        </button>

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

              {isFromHistory && (
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: '#dbeafe',
                  border: '1px solid #3b82f6',
                  borderRadius: '6px',
                  color: '#1e40af',
                  fontSize: '12px',
                  marginBottom: '12px',
                  fontWeight: '500'
                }}>
                  📂 Showing results from search history
                </div>
              )}

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

              {!places.length && preferences.region && !isFromHistory && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #f59e0b',
                  borderRadius: '8px',
                  color: '#92400e',
                  fontSize: '14px',
                  marginTop: '12px'
                }}>
                  💡 No search results found. Go to Preferences to search for places.
                </div>
              )}
            </div>

            <div >
              <h3 className={styles.result_cardTitle}>
                📍 Results ({places.length})
                {isFromHistory && <span style={{ fontSize: '12px', color: '#6b7280' }}> from history</span>}
              </h3>

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
                <MapPinned className={styles.mapIcon} /> Map
              </h3>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                {preferences.region ? `Showing results for ${preferences.region}` : 'Set region in preferences'}
              </span>
            </div>

            {mapError ? (
              <div className={styles.errorMessage}>
                <p>❌ Error loading map: {mapError}</p>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}