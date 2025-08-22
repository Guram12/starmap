'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Preferences.module.css';
import { usePlacesSearch } from '../../hooks/usePlacesSearch';
import { useGoogleMap } from '../../hooks/useGoogleMap';
import { useAuth } from '../AuthProvider';

type PlaceType = 'restaurant' | 'lodging' | 'tourist_attraction' | 'shopping_mall' | 'hospital';

export default function Preferences() {
  const [region, setRegion] = useState('');
  const [placeType, setPlaceType] = useState<PlaceType>('restaurant');
  const [minStars, setMinStars] = useState(3);
  const [searchRadius, setSearchRadius] = useState(5);
  const [showSuccess, setShowSuccess] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const { mapRef, map, isLoaded } = useGoogleMap();
  const { places, loading, error: searchError, searchPlaces, geocodeLocation } = usePlacesSearch();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const savedPrefs = localStorage.getItem('starmap-preferences');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setRegion(prefs.region || '');
      setPlaceType(prefs.placeType || 'restaurant');
      setMinStars(prefs.minStars || 3);
      setSearchRadius(prefs.searchRadius || 5);
    }
  }, []);

  const getCurrentLocation = () => {
    setLocationLoading(true);

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setRegion(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setLocationLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Unable to get location. ';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }

        alert(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const savePreferences = async () => {
    if (!region.trim()) {
      alert('Please enter a region before saving.');
      return;
    }

    setSearchLoading(true);

    try {
      const preferences = {
        region,
        placeType,
        minStars,
        searchRadius,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('starmap-preferences', JSON.stringify(preferences));

      if (map && isLoaded) {
        console.log('🔍 PREFERENCES: Starting search with saved preferences');
        
        const location = await geocodeLocation(region);
        
        if (location) {
          await searchPlaces(map, {
            location,
            radius: searchRadius,
            type: placeType,
            minRating: minStars
          }, region);

          console.log('✅ PREFERENCES: Search completed, storing results');
        } else {
          throw new Error('Could not find the specified location');
        }
      } else {
        throw new Error('Map not ready for search');
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error('Error saving preferences or searching:', error);
      alert('Error: ' + (error as Error).message);
    } finally {
      setSearchLoading(false);
    }
  };

  // Store search results when places update
  useEffect(() => {
    if (places && places.length > 0) {
      const searchResults = {
        places,
        searchParams: { region, placeType, minStars, searchRadius },
        timestamp: new Date().toISOString(),
        fromHistory: false // Mark as fresh search
      };
      localStorage.setItem('starmap-search-results', JSON.stringify(searchResults));
      console.log('✅ PREFERENCES: Search results stored in localStorage');

      // Also save to database if authenticated
      if (isAuthenticated) {
        saveSearchWithPlacesToDatabase();
      }
    }
  }, [places, region, placeType, minStars, searchRadius, isAuthenticated]);

  const saveSearchWithPlacesToDatabase = async () => {
    console.log('💾 PREFERENCES: Saving search with places to database:', {
      placesCount: places.length,
      region,
      placeType
    });

    try {
      const response = await fetch('/api/search-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          region,
          placeType,
          minStars,
          searchRadius,
          resultsCount: places.length,
          places: places.map(place => ({
            id: place.id,
            displayName: place.displayName,
            rating: place.rating,
            formattedAddress: place.formattedAddress,
            location: {
              lat: place.location.lat(),
              lng: place.location.lng()
            },
            types: place.types,
            priceLevel: place.priceLevel,
            websiteURI: place.websiteURI,
            nationalPhoneNumber: place.nationalPhoneNumber,
          }))
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ PREFERENCES: Search results saved to database with places:', result.searchHistory?.places?.length || 0);
      } else {
        console.error('❌ PREFERENCES: Failed to save to database');
      }
    } catch (error) {
      console.error('❌ PREFERENCES: Error saving search to database:', error);
    }
  };

  const getPlaceTypeIcon = (type: PlaceType): string => {
    const icons: Record<PlaceType, string> = {
      restaurant: '🍽️',
      lodging: '🏨',
      tourist_attraction: '🏛️',
      shopping_mall: '🛍️',
      hospital: '🏥'
    };
    return icons[type] || '📍';
  };

  
  return (
    <div className={styles.preferencesPage}>
      <div className={styles.container}>
        {/* Hidden map for search functionality */}
        <div style={{ display: 'none' }}>
          <div ref={mapRef} style={{ width: '100px', height: '100px' }} />
        </div>

        <div className={styles.header}>
          <h1 className={styles.title}>
            ⚙️ Set Your Preferences
          </h1>
          <p className={styles.subtitle}>
            Customize your search criteria to find the perfect places
          </p>
        </div>

        <form className={styles.form} onSubmit={(e) => { e.preventDefault(); savePreferences(); }}>
          <div className={styles.field}>
            <label htmlFor="region" className={styles.label}>
              📍 Region
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                id="region"
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Enter city or area name (e.g., New York, Paris)"
                className={styles.input}
                style={{ flex: 1 }}
                required
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className={`${styles.actionBtn}`}
                style={{
                  minWidth: '120px',
                  fontSize: '12px',
                  padding: '8px 12px',
                  backgroundColor: locationLoading ? '#9ca3af' : '#059669',
                  cursor: locationLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {locationLoading ? '🔄 Getting...' : '📍 Use Current'}
              </button>
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              💡 You can type a location or use your current position
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="placeType" className={styles.label}>
              {getPlaceTypeIcon(placeType)} Place Type
            </label>
            <select
              id="placeType"
              value={placeType}
              onChange={(e) => setPlaceType(e.target.value as PlaceType)}
              className={styles.select}
            >
              <option value="restaurant">🍽️ Restaurants</option>
              <option value="lodging">🏨 Lodging</option>
              <option value="tourist_attraction">🏛️ Tourist Attractions</option>
              <option value="shopping_mall">🛍️ Shopping Centers</option>
              <option value="hospital">🏥 Healthcare</option>
            </select>
          </div>

          <div className={styles.field}>
            <div className={styles.rangeContainer}>
              <div className={styles.rangeLabel}>
                <label htmlFor="minStars" className={styles.label}>
                  ⭐ Minimum Stars
                </label>
                <span className={styles.rangeValue}>
                  <span className={styles.starsDisplay}>
                    {'⭐'.repeat(Math.floor(minStars))}
                  </span>
                  {minStars}
                </span>
              </div>
              <input
                id="minStars"
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={minStars}
                onChange={(e) => setMinStars(Number(e.target.value))}
                className={styles.rangeInput}
              />
            </div>
          </div>

          <div className={styles.field}>
            <div className={styles.rangeContainer}>
              <div className={styles.rangeLabel}>
                <label htmlFor="searchRadius" className={styles.label}>
                  🎯 Search Radius
                </label>
                <span className={styles.rangeValue}>
                  {searchRadius} km
                </span>
              </div>
              <input
                id="searchRadius"
                type="range"
                min="1"
                max="10"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className={styles.rangeInput}
              />
              <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '4px', fontWeight: '500' }}>
                ⚠️ Maximum 15 places shown to reduce API costs
              </div>
            </div>
          </div>

          {searchLoading && (
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#dbeafe', 
              border: '1px solid #3b82f6', 
              borderRadius: '8px', 
              color: '#1e40af',
              textAlign: 'center',
              margin: '16px 0'
            }}>
              🔍 Searching for places... Please wait.
            </div>
          )}

          {searchError && (
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#fef2f2', 
              border: '1px solid #ef4444', 
              borderRadius: '8px', 
              color: '#dc2626',
              textAlign: 'center',
              margin: '16px 0'
            }}>
              ❌ Search Error: {searchError}
            </div>
          )}

          {showSuccess && (
            <div className={styles.successMessage}>
              ✅ Preferences saved and places searched successfully! Found {places.length} places.
            </div>
          )}

          <div className={styles.actions}>
            <button 
              type="submit" 
              className={`${styles.actionBtn} ${styles.saveBtn}`}
              disabled={searchLoading || !isLoaded}
            >
              {searchLoading ? '🔍 Searching...' : '💾 Save & Search'}
            </button>
            <Link href="/map" className={`${styles.actionBtn} ${styles.mapBtn}`}>
              🗺️ Go to Map
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}