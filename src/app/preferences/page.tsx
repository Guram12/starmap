'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Preferences.module.css';  // ✅ Correct
// Define the place type options
type PlaceType = 'restaurant' | 'lodging' | 'tourist_attraction' | 'shopping_mall' | 'hospital';

export default function Preferences() {
  const [region, setRegion] = useState('');
  const [placeType, setPlaceType] = useState<PlaceType>('restaurant');
  const [minStars, setMinStars] = useState(3);
  const [searchRadius, setSearchRadius] = useState(5);
  const [showSuccess, setShowSuccess] = useState(false);

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
            <input
              id="region"
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="Enter city or area name (e.g., New York, Paris)"
              className={styles.input}
              required
            />
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
                max="50"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className={styles.rangeInput}
              />
            </div>
          </div>

          {showSuccess && (
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
            <Link href="/" className={`${styles.actionBtn} ${styles.homeBtn}`}>
              🏠 Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}




// AIzaSyDOQLep8QAZSpc6KNlXEoejETmUYQf00kg