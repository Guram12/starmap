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
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);

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
      if (!map || !preferences.region || !isLoaded) return;

      try {
        const location = await geocodeLocation(preferences.region);
        if (location) {
          map.setCenter(location);
          map.setZoom(12);

          await searchPlaces(map, {
            location,
            radius: preferences.searchRadius,
            type: preferences.placeType,
            minRating: preferences.minStars
          }, preferences.region); // Pass the region name
        }
      } catch (error) {
        console.error('Search failed:', error);
      }
    };

    if (prefsLoaded && preferences.region) {
      performSearch();
    }
  }, [map, isLoaded, preferences, prefsLoaded, searchPlaces, geocodeLocation]);


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
    markers.forEach(marker => marker.map = null);

    // Create new markers using Advanced Markers (new API)
    const newMarkers = places.map(place => {
      // Create marker element
      const markerElement = document.createElement('div');
      markerElement.innerHTML = getMarkerIcon(preferences.placeType);
      markerElement.style.width = '32px';
      markerElement.style.height = '32px';
      markerElement.style.borderRadius = '50%';
      markerElement.style.display = 'flex';
      markerElement.style.alignItems = 'center';
      markerElement.style.justifyContent = 'center';
      markerElement.style.backgroundColor = '#ffffff';
      markerElement.style.border = '2px solid #1f2937';
      markerElement.style.cursor = 'pointer';

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: place.location,
        content: markerElement,
        title: place.displayName,
      });

      // Add info window
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
    photos?: google.maps.places.Photo[];
    priceLevel?: google.maps.places.PriceLevel | null;
    rating?: number | null;
    formattedAddress?: string | null;
    websiteURI?: string | null;
  }): string => {
    const photoUrl = place.photos && place.photos.length > 0
      ? place.photos[0].getURI({ maxWidth: 200, maxHeight: 150 })
      : '';

    const priceLevel = place.priceLevel ? '$'.repeat(Number(place.priceLevel)) : '';

    return `
      <div style="max-width: 250px; padding: 10px;">
        ${photoUrl ? `<img src="${photoUrl}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />` : ''}
        <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937;">${place.displayName}</h3>
        <div style="display: flex; align-items: center; margin-bottom: 4px;">
          <span style="color: #fbbf24; margin-right: 4px;">⭐</span>
          <span style="font-weight: 600; color: #374151;">${place.rating || 'N/A'}</span>
        </div>
        <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">${place.formattedAddress || 'Address not available'}</p>
        ${priceLevel ? `<p style="margin: 4px 0; color: #10b981; font-size: 14px;">Price: ${priceLevel}</p>` : ''}
        ${place.websiteURI ? `<a href="${place.websiteURI}" target="_blank" style="color: #3b82f6; font-size: 14px;">Visit Website</a>` : ''}
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