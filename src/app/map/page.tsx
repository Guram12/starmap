'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MapPage() {
  const [region, setRegion] = useState('');
  const [placeType, setPlaceType] = useState('restaurant');
  const [minStars, setMinStars] = useState(3);
  const [searchRadius, setSearchRadius] = useState(5);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

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
    return <div>Loading preferences...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🗺️ Map Page</h1>
      
      <div style={{ background: '#F5F5F541', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3>Current Search Settings:</h3>
        <p><strong>Region:</strong> {region || 'Not set'}</p>
        <p><strong>Place Type:</strong> {placeType}</p>
        <p><strong>Minimum Stars:</strong> {minStars}</p>
        <p><strong>Search Radius:</strong> {searchRadius} km</p>
      </div>

      {!region && (
        <div style={{ background: '#fff3cd', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <p>⚠️ No region set. Please set your preferences first.</p>
          <Link href="/preferences" style={{ color: '#0070f3' }}>
            Set Preferences
          </Link>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/preferences" style={{ padding: '0.5rem 1rem', background: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Update Preferences
        </Link>
        <Link href="/" style={{ padding: '0.5rem 1rem', background: '#6b7280', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Back to Home
        </Link>
      </div>

      <div style={{ marginTop: '2rem', padding: '2rem', border: '2px dashed #ccc', textAlign: 'center' }}>
        <p>🚧 Interactive map will be implemented here</p>
        <p>Will show places matching your criteria: {placeType} with {minStars}+ stars within {searchRadius}km of {region || 'selected region'}</p>
      </div>
    </div>
  );
}