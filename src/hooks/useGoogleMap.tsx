import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapOptions {
  center?: { lat: number; lng: number };
  zoom?: number;
}

export function useGoogleMap(options: MapOptions = {}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          version: 'weekly',
          libraries: ['places', 'geometry', 'marker']
        });

        // Wait for the maps library to be fully loaded
        const { Map } = await loader.importLibrary('maps') as google.maps.MapsLibrary;

        // Add a check to ensure the DOM element is ready
        if (!mapRef.current) {
          console.log('Map container not ready, retrying...');
          // Retry after a short delay
          setTimeout(() => {
            if (mapRef.current) {
              initMap();
            }
          }, 100);
          return;
        }

        const mapInstance = new Map(mapRef.current, {
          center: options.center || { lat: 40.7128, lng: -74.0060 },
          zoom: options.zoom || 12,
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        });

        setMap(mapInstance);

        // Wait for map to be fully initialized
        google.maps.event.addListenerOnce(mapInstance, 'idle', () => {
          setIsLoaded(true);
          console.log('✅ Google Maps API fully loaded and ready');
        });

      } catch (err) {
        setError('Failed to load Google Maps');
        console.error('Google Maps loading error:', err);
      }
    };

    // Add a small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      initMap();
    }, 50);

    return () => clearTimeout(timer);
  }, [options.center, options.zoom]);

  return { mapRef, map, isLoaded, error };
}