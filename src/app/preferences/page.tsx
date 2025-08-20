'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../page.module.css'




export default function Preferences() {
  const [region, setRegion] = useState('');
  const [placeType, setPlaceType] = useState('restaurant');
  const [minStars, setMinStars] = useState(3);
  const [searchRadius, setSearchRadius] = useState(5);

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
    alert('Preferences saved!');
  };

  return (
    <div className={styles.container}>
      <h1>Set Your Preferences</h1>
      
      <form className={styles.form} onSubmit={(e) => { e.preventDefault(); savePreferences(); }}>
        <div className={styles.field}>
          <label htmlFor="region">Region</label>
          <input
            id="region"
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="Enter city or area name"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="placeType">Place Type</label>
          <select
            id="placeType"
            value={placeType}
            onChange={(e) => setPlaceType(e.target.value)}
          >
            <option value="restaurant">Restaurants</option>
            <option value="hotel">Hotels</option>
            <option value="tourist_attraction">Tourist Attractions</option>
            <option value="shopping_mall">Shopping Centers</option>
            <option value="hospital">Healthcare</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="minStars">Minimum Stars: {minStars}</label>
          <input
            id="minStars"
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={minStars}
            onChange={(e) => setMinStars(Number(e.target.value))}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="searchRadius">Search Radius: {searchRadius} km</label>
          <input
            id="searchRadius"
            type="range"
            min="1"
            max="50"
            value={searchRadius}
            onChange={(e) => setSearchRadius(Number(e.target.value))}
          />
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveBtn}>
            Save Preferences
          </button>
          <Link href="/map" className={styles.mapBtn}>
            Go to Map
          </Link>
          <Link href="/" className={styles.homeBtn}>
            Back to Home
          </Link>
        </div>
      </form>
    </div>
  );
}