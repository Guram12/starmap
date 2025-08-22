'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Preferences.module.css';

type PlaceType = 'restaurant' | 'lodging' | 'tourist_attraction' | 'shopping_mall' | 'hospital';

export default function Preferences() {
  const [region, setRegion] = useState('');
  const [placeType, setPlaceType] = useState<PlaceType>('restaurant');
  const [minStars, setMinStars] = useState(3);
  const [searchRadius, setSearchRadius] = useState(5);
  const [showSuccess, setShowSuccess] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Load preferences from localStorage on component mount
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

        // Set coordinates directly in the format "lat,lng"
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


  const savePreferences = () => {
    const preferences = {
      region,
      placeType,
      minStars,
      searchRadius,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('starmap-preferences', JSON.stringify(preferences));
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
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

          {!showSuccess && (
            <div className={styles.successMessage}>
              ✅ Preferences saved successfully!
            </div>
          )}

          <div className={styles.actions}>
            <button type="submit" className={`${styles.actionBtn} ${styles.saveBtn}`}>
              💾 Save Preferences
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