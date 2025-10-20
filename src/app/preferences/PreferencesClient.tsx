'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import styles from './Preferences.module.css';
import { usePlacesSearch } from '../../hooks/usePlacesSearch';
import { useGoogleMap } from '../../hooks/useGoogleMap';
import { useAuth } from '../AuthProvider';
import { useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';
import { FaLocationCrosshairs } from "react-icons/fa6";
import { BarLoader } from 'react-spinners';
import { motion } from 'framer-motion';


type PlaceType = 'restaurant' | 'lodging' | 'tourist_attraction' | 'shopping_mall' | 'hospital';

export default function PreferencesClient() {
  const [region, setRegion] = useState<string>('');
  const [placeType, setPlaceType] = useState<PlaceType>('restaurant');
  const [minStars, setMinStars] = useState<number>(3);
  const [searchRadius, setSearchRadius] = useState<number>(5);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);


  useEffect(() => {
    console.log('--- PreferencesClient mounted ---');
  }, []);

  // ============================================================================================================
  // ============================  for future search settings i should add this fields ==========================
  // ============================================================================================================

  // const [openNow, setOpenNow] = useState<boolean>(false);
  // const [priceLevel, setPriceLevel] = useState<number[]>([1, 2, 3, 4]); // Array for multiple price levels
  // const [keyword, setKeyword] = useState<string>('');
  // const [includeRatingsOnly, setIncludeRatingsOnly] = useState<boolean>(false);
  // const [businessStatus, setBusinessStatus] = useState<'all' | 'operational_only'>('all');

  const [show_search_button, setShow_search_button] = useState<boolean>(true);


  const { mapRef, map, isLoaded } = useGoogleMap();
  const { places, loading, setLoading, error: searchError, setError, searchPlaces, geocodeLocation } = usePlacesSearch();
  const { isAuthenticated } = useAuth();


  useEffect(() => {
    console.log('--- isAuthenticated changed ---', isAuthenticated);
    if (!isAuthenticated) {
      console.log('👤 User logged out - clearing places and loading state');
      setLoading(false);
    }
  }, [isAuthenticated]);



  // ================================================ load saved preferences ================================================
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

  // ===================================================  current location ===================================================
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
        maximumAge: 300000
      }
    );
  };

  // ==============================================  save preferences & search ================================================

  const savePreferences = async () => {
    if (!region.trim()) {
      alert('Please enter a region before saving.');
      return;
    }

    setLoading(true);
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
          setError('Could not find the specified location');
        }
      } else {
        throw new Error('Map not ready for search');
      }


    } catch (error) {
      console.error('Error saving preferences or searching:', error);
      alert('Error: ' + (error as Error).message);
    } finally {
      setSearchLoading(false);
    }
  };

  // ===================================================  save to database ===================================================

  const saveSearchWithPlacesToDatabase = useCallback(async () => {
    // Only save to database if user is authenticated
    if (!isAuthenticated) {
      console.log('👤 PREFERENCES: User not authenticated - skipping database save');
      return;
    }

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
              : null
          }))
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ PREFERENCES: Search results saved to database with places:', result.searchHistory?.places?.length || 0);
        setLoading(false);
      } else {
        console.error('❌ PREFERENCES: Failed to save to database');
      }
    } catch (error) {
      console.error('❌ PREFERENCES: Error saving search to database:', error);
    }
  }, [places, region, placeType, minStars, searchRadius, isAuthenticated]);

  // =================================================  store in localStorage =================================================


  useEffect(() => {
    if (places && places.length > 0) {
      const searchResults = {
        places: places.map(place => ({
          ...place,
          location: {
            lat: place.location.lat(),
            lng: place.location.lng()
          },
          // Extract photo URL here
          photoUrl: place.photos && place.photos.length > 0 && typeof place.photos[0].getUrl === 'function'
            ? place.photos[0].getUrl({ maxWidth: 200, maxHeight: 150 })
            : null
        })),
        searchParams: { region, placeType, minStars, searchRadius },
        timestamp: new Date().toISOString(),
        fromHistory: false // Mark as fresh search
      };

      // Always save to localStorage (overwrites previous search for non-authenticated users)
      localStorage.setItem('starmap-search-results', JSON.stringify(searchResults));
      console.log('✅ PREFERENCES: Search results stored in localStorage', {
        authenticated: isAuthenticated,
        placesCount: places.length
      });

      // Only save to database if authenticated
      if (isAuthenticated) {
        saveSearchWithPlacesToDatabase();
      } else {
        console.log('👤 PREFERENCES: Non-authenticated user - only saving to localStorage');
        // Ensure loading is set to false for non-authenticated users
        setLoading(false);
      }
    }
  }, [places, saveSearchWithPlacesToDatabase, isAuthenticated]); // Add missing dependencies


  // ===================================================  focus region input ===================================================

  const regionInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('f') === 'region' && regionInputRef.current) {
      regionInputRef.current.focus();
    }
  }, [searchParams]);


  // ===================================================  utility functions ===================================================

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




  // =============================== change background color when  search finishes =====================================

  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchLoading && places.length > 0) {
      const timer = setTimeout(() => {
        if (backgroundRef.current) {
          gsap.to(backgroundRef.current, {
            duration: 2,
            background: '#10b981',
            ease: "power2.inOut"
          });
        }
      }, 200);

      return () => clearTimeout(timer);
    }

    if (searchError !== null) {
      if (backgroundRef.current) {
        gsap.to(backgroundRef.current, {
          duration: 2,
          background: '#F50B0B',
          ease: "power2.inOut"
        });
      }
    }

  }, [searchLoading, places.length, searchError]);


  useEffect(() => {
    console.log('--error--', searchError);
  }, [searchError]);

  // ----------------------------------------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      if (backgroundRef.current) {
        gsap.to(backgroundRef.current, {
          duration: 3,
          background: '#667eea',
          ease: "power2.inOut"
        });
      }
    }, 200);

    setError(null);
    return () => clearTimeout(timer);
  }, [region, placeType, minStars, searchRadius])

  // =========================================  showing and removing search button =============================================

  useEffect(() => {
    if (region && placeType && minStars && searchRadius) {
      setShow_search_button(true);
    }
  }, [region, placeType, minStars, searchRadius]);

  // ==========================================================================================================================

  return (
    <div
      ref={backgroundRef}
      className={styles.preferencesPage}
    >
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          mass: 1,
          duration: 0.6
        }}
      >
        {/* Hidden map for search functionality */}
        <div style={{ display: 'none' }}>
          <div ref={mapRef} style={{ width: '100px', height: '100px' }} />
        </div>

        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <h1 className={styles.title}>
            ⚙️ Set Your Preferences
          </h1>
          <p className={styles.subtitle}>
            Customize your search criteria to find the perfect places
          </p>
        </motion.div>

        <motion.form
          className={styles.form}
          onSubmit={(e) => { e.preventDefault(); savePreferences(); setShow_search_button(false); }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <motion.div
            className={styles.field}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <label htmlFor="region" className={styles.label}>
              📍 Region
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                id="region"
                type="text"
                value={region}
                ref={regionInputRef}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Enter city or area name (e.g., New York, Paris)"
                className={styles.input}
                style={{ flex: 1 }}
                required
              />
              <div
                onClick={getCurrentLocation}
                className={styles.set_current_location_div}
                style={{
                  cursor: locationLoading ? 'not-allowed' : 'pointer'
                }}
              >
                <FaLocationCrosshairs
                  style={{
                    marginRight: '4px',
                    color: 'black',
                    width: '30px',
                    height: '30px'
                  }}
                />
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              💡 You can type a location or use your current position
            </div>
          </motion.div>

          <motion.div
            className={styles.field}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.25 }}
          >
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
          </motion.div>

          <motion.div
            className={styles.field}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.25 }}
          >
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
          </motion.div>

          <motion.div
            className={styles.field}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.25 }}
          >
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
            </div>
          </motion.div>


          {searchError === null ? null :
            <motion.div
              style={{ width: '100%' }}
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >

              <p className={styles.errorMessage}>
                ❌ Search Error: {searchError}
              </p>
            </motion.div>
          }


          {loading && (
            <motion.div
              className={styles.loading_cont}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <BarLoader speedMultiplier={2} color='#10b981' />
            </motion.div>
          )}

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            {show_search_button && (
              <motion.button
                type="submit"
                className={`${styles.actionBtn} ${styles.saveBtn}`}
                disabled={loading || !isLoaded}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.25 }}
              >
                {'💾 Save & Search'}
              </motion.button>
            )}

            {!loading && places.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.25 }}
              >
                <Link href="/map" className={`${styles.actionBtn} ${styles.mapBtn}`}>
                  🗺️ Go to Map. ( places found {places.length} )
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
}