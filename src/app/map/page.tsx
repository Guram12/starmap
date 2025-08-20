'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Map.module.css';

export default function MapPage() {
  const [region, setRegion] = useState<string>('');
  const [placeType, setPlaceType] = useState<string>('restaurant');
  const [minStars, setMinStars] = useState<number>(3);
  const [searchRadius, setSearchRadius] = useState<number>(5);
  const [prefsLoaded, setPrefsLoaded] = useState<boolean>(false);

  // Load preferences from localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('starmap-preferences');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setRegion(prefs.region || '');
      setPlaceType(prefs.placeType || 'restaurant');
      setMinStars(prefs.minStars || 3);
      setSearchRadius(prefs.searchRadius || 5);
    }
    setPrefsLoaded(true);
  }, []);

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
            <div className={styles.settingsCard}>
              <h3 className={styles.cardTitle}>
                ⚙️ Current Settings
              </h3>
              <div className={styles.settingItem}>
                <span className={styles.settingLabel}>Region:</span>
                <span className={styles.settingValue}>
                  {region || 'Not set'}
                </span>
              </div>
              <div className={styles.settingItem}>
                <span className={styles.settingLabel}>Place Type:</span>
                <span className={styles.settingValue}>
                  {placeType.charAt(0).toUpperCase() + placeType.slice(1)}
                </span>
              </div>
              <div className={styles.settingItem}>
                <span className={styles.settingLabel}>Minimum Stars:</span>
                <span className={styles.settingValue}>
                  {'⭐'.repeat(Math.floor(minStars))} {minStars}
                </span>
              </div>
              <div className={styles.settingItem}>
                <span className={styles.settingLabel}>Search Radius:</span>
                <span className={styles.settingValue}>
                  {searchRadius} km
                </span>
              </div>
            </div>

            {!region && (
              <div className={styles.warningCard}>
                <div>
                  <span className={styles.warningIcon}>⚠️</span>
                  <strong>No region set!</strong>
                </div>
                <p className={styles.warningText}>
                  Please set your preferences to start exploring places.
                </p>
                <Link href="/preferences" className={styles.warningLink}>
                  Set Preferences →
                </Link>
              </div>
            )}

            <div className={styles.actions}>
              <Link href="/preferences" className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                ⚙️ Update Preferences
              </Link>
              <Link href="/" className={`${styles.actionBtn} ${styles.secondaryBtn}`}>
                🏠 Back to Home
              </Link>
            </div>
          </div>

          <div className={styles.mapContainer}>
            <div className={styles.mapHeader}>
              <h3 className={styles.mapTitle}>
                📍 Interactive Map
              </h3>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                {region ? `Searching in ${region}` : 'Set region to search'}
              </span>
            </div>
            
            <div className={styles.mapPlaceholder}>
              <div className={styles.placeholderIcon}>🗺️</div>
              <h3 className={styles.placeholderTitle}>
                Interactive Map Coming Soon
              </h3>
              <p className={styles.placeholderText}>
                This is where the interactive map will show places matching your criteria:
                <br />
                <strong>{placeType}</strong> with <strong>{minStars}+ stars</strong> within{' '}
                <strong>{searchRadius}km</strong> of{' '}
                <strong>{region || 'your selected region'}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}