'use client';

import { useState, useEffect } from 'react';
import { useGoogleMap } from '../../hooks/useGoogleMap';
import styles from './Map.module.css';
import { MapPinned } from 'lucide-react';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useAuth } from '../AuthProvider';
import { motion } from 'framer-motion';



interface Place {
  id: string;
  displayName: string;
  rating?: number | null;
  formattedAddress?: string | null;
  location: google.maps.LatLng;
  photos?: google.maps.places.PlacePhoto[];
  photoUrl?: string | null;
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

export default function MapClient() {
  const [preferences, setPreferences] = useState<Preferences>({
    region: '',
    placeType: 'restaurant',
    minStars: 3,
    searchRadius: 5
  });
  const [places, setPlaces] = useState<Place[]>([]);
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const [isFromHistory, setIsFromHistory] = useState(false);

  const [markerInfoPairs, setMarkerInfoPairs] = useState<{
    marker: google.maps.marker.AdvancedMarkerElement;
    infoWindow: google.maps.InfoWindow;
  }[]>([]);


  const [selected_PlaceID_From_List, setSelected_PlaceID_From_List] = useState('');



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
        photoUrl?: string | null;
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
          // Add photo URL extraction
          photoUrl: place.photos && place.photos.length > 0 && typeof place.photos[0].getUrl === 'function'
            ? place.photos[0].getUrl({ maxWidth: 200, maxHeight: 150 })
            : place.photoUrl ?? null // Use existing photoUrl if available
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
    if (!map || !places.length || !window.google?.maps?.marker?.AdvancedMarkerElement) {
      markerInfoPairs.forEach(({ marker }) => {
        if (marker.map) marker.map = null;
      });
      setMarkerInfoPairs([]);
      return;
    }

    markerInfoPairs.forEach(({ marker }) => {
      if (marker.map) marker.map = null;
    });

    const newPairs = places.map(place => {
      const markerElement = document.createElement('div');
      markerElement.innerHTML = `
    <div 
    style="background: #1f2937;
           color: white;
           border-radius: 50%;
           width: 32px;
           height: 32px;
           display: flex;
           align-items: center;
           justify-content: center;
           font-size: 16px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
      ${getMarkerIcon(preferences.placeType)}
    </div>
  `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: place.location,
        title: place.displayName,
        content: markerElement
      });

      // Add info window with image support
      const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(place)
      });

      markerElement.addEventListener('click', () => {
        // Close all info windows first
        markerInfoPairs.forEach(({ infoWindow: otherInfoWindow }) => {
          otherInfoWindow.close();
        });

        // Open this info window
        infoWindow.open(map, marker);

        // Update selected place ID
        setSelected_PlaceID_From_List(place.id);
      });
      return { marker, infoWindow };
    });

    setMarkerInfoPairs(newPairs);

    return () => {
      newPairs.forEach(({ marker }) => {
        if (marker.map) marker.map = null;
      });
    };
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
  const createInfoWindowContent = (place: Place): string => {
    const photoUrl = place.photoUrl;
    const lat = place.location.lat();
    const lng = place.location.lng();
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${place.id}`;

    return `
    <div style="
      max-width: 220px;
      padding: 10px;
      background: #059669;
      color: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      font-family: 'Inter', sans-serif;
    ">
      ${photoUrl ? `
        <img 
          src="${photoUrl}" 
          alt="${place.displayName}"
          style="
            width: 100%; 
            height: 120px; 
            object-fit: cover; 
            border-radius: 6px; 
            margin-bottom: 8px;
          "
        />
      ` : ''}
      <h3 style="margin: 0 0 4px 0; font-size: 15px;">${place.displayName}</h3>
      <div style="margin-bottom: 4px;">
        <span style="color: #fbbf24;">⭐</span>
        <span style="font-weight: 600;">${place.rating || 'N/A'}</span>
      </div>
      <p style="margin: 0 0 8px 0; font-size: 12px;">${place.formattedAddress || 'Address not available'}</p>
      <button 
        onclick="window.open('${googleMapsUrl}', '_blank')"
        style="
          background: #ffffff;
          color: #059669;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          transition: all 0.2s;
        "
        onmouseover="this.style.background='#f3f4f6'"
        onmouseout="this.style.background='#ffffff'"
      >
        🗺️ Open in Google Maps
      </button>
    </div>
  `;
  };

  useEffect(() => {
    console.log('places ===>>>> ', places)
  }, [places]);



  const handlePlaceClickOnList = (placeId: string) => {
    setSelected_PlaceID_From_List(placeId);
    // Close all info windows first
    markerInfoPairs.forEach(({ infoWindow }) => {
      infoWindow.close();
    });

    // Find the place by ID to get its index
    const placeIndex = places.findIndex(place => place.id === placeId);

    if (placeIndex !== -1 && markerInfoPairs[placeIndex]) {
      const pair = markerInfoPairs[placeIndex];
      pair.infoWindow.open(map, pair.marker);
      map?.panTo(pair.marker.position as google.maps.LatLng);
      map?.setZoom(14);
    }

    if (window.innerWidth < 480 && map) {
      window.scrollY = map.getDiv().offsetTop;
      window.scrollTo({ top: window.scrollY, behavior: 'smooth' });
    }
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
        <motion.div
          className={styles.no_region_errorMessage}
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            mass: 1,
            duration: 0.6,
            delay: 0.3,
          }}
        >
          <p>⚠️ No region set. Please go to Preferences to set your search criteria.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            mass: 1,
            duration: 0.6,
            // delay: 0.1,
          }}
        >
          <button
            className={styles.setregion_button}

          >
            <a href="/preferences?f=region" className={styles.actionBtn}>
              ⚙️ Go to Preferences
            </a>
          </button>
        </motion.div>

      </div>
    );
  }


  return (
    <motion.div 
      className={styles.mapPage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className={styles.container}>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
        >
          <motion.div 
            className={styles.sidebar}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.25 }}
          >
            <motion.div 
              className={styles.settingsCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
            >
              <motion.h3 
                className={styles.cardTitle}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.15 }}
              >
                ⚙️ Current Settings
              </motion.h3>

              {isFromHistory && (
                <motion.div 
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#dbeafe',
                    border: '1px solid #3b82f6',
                    borderRadius: '6px',
                    color: '#1e40af',
                    fontSize: '12px',
                    marginBottom: '12px',
                    fontWeight: '500'
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.22, duration: 0.15 }}
                >
                  📂 Showing results from search history
                </motion.div>
              )}

              <motion.div 
                className={styles.settingItem}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.1 }}
              >
                <span className={styles.settingLabel}>📍 Region:</span>
                <span className={styles.settingValue}>{preferences.region || 'Not set'}</span>
              </motion.div>
              <motion.div 
                className={styles.settingItem}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.1 }}
              >
                <span className={styles.settingLabel}>🛍️ Place Type:</span>
                <span className={styles.settingValue}>{preferences.placeType}</span>
              </motion.div>
              <motion.div 
                className={styles.settingItem}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.1 }}
              >
                <span className={styles.settingLabel}>⭐ Min Stars:</span>
                <span className={styles.settingValue}>{preferences.minStars}</span>
              </motion.div>
              <motion.div 
                className={styles.settingItem}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.1 }}
              >
                <span className={styles.settingLabel}>🎯 Search Radius:</span>
                <span className={styles.settingValue}>{preferences.searchRadius} km</span>
              </motion.div>

              {!places.length && preferences.region && !isFromHistory && (
                <motion.div 
                  style={{
                    padding: '12px',
                    backgroundColor: '#fef3c7',
                    border: '1px solid #f59e0b',
                    borderRadius: '8px',
                    color: '#92400e',
                    fontSize: '14px',
                    marginTop: '12px'
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45, duration: 0.15 }}
                >
                  💡 No search results found. Go to Preferences to search for places.
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.2 }}
            >
              <h3 className={styles.result_cardTitle}>
                📍 Results ({places.length})
                {isFromHistory && <span style={{ fontSize: '12px', color: '#6b7280' }}> from history</span>}
              </h3>

              {places.length > 0 && (
                <motion.div 
                  className={styles.placesList}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.2 }}
                >
                  {places.map((place, idx) => (
                    <motion.div
                      key={place.id}
                      className={`${styles.placeItem} ${selected_PlaceID_From_List === place.id ? styles.selectedPlace : ''}`}
                      onClick={() => handlePlaceClickOnList(place.id)}
                      style={{ cursor: 'pointer' }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: 0.6 + (idx * 0.03), 
                        duration: 0.2 
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={styles.placeName}>{place.displayName}</div>
                      <div className={styles.placeRating}>⭐ {place.rating || 'N/A'}</div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>

          </motion.div>

          <motion.div 
            className={styles.mapContainer}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className={styles.mapHeader}>
              <h3 className={styles.mapTitle}>
                <MapPinned className={styles.mapIcon} /> Map
              </h3>
              <span className={styles.mapSubtitle}>
                {preferences.region ? `Results for ${preferences.region}` : 'Set region in preferences'}
              </span>
            </div>

            {mapError ? (
              <div className={styles.errorMessage}>
                <p>❌ Error loading map: {mapError}</p>
              </div>
            ) : (
              <div ref={mapRef} className={styles.mapDiv} />
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}