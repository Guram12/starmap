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
  const mapInitialized = useRef(false);

  useEffect(() => {
    if (mapInitialized.current) return;

    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          version: 'weekly',
          libraries: ['places', 'geometry', 'marker']
        });

        const { Map } = await loader.importLibrary('maps') as google.maps.MapsLibrary;

        // Wait for mapRef to be available
        const checkMapRef = setInterval(() => {
          if (mapRef.current && !mapInitialized.current) {
            clearInterval(checkMapRef);

            const mapInstance = new Map(mapRef.current, {
              center: options.center || { lat: 41.7151, lng: 44.8271 }, // Tbilisi, Georgia as default
              zoom: options.zoom || 13,
              mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
              mapTypeControl: true,
              streetViewControl: true,
              fullscreenControl: true,
              zoomControl: true,
            });

            setMap(mapInstance);
            mapInitialized.current = true;
            setIsLoaded(true);

            console.log('✅ Google Maps API fully loaded and ready');
          }
        }, 100);

        // Clear interval after 5 seconds if map ref is still not available
        setTimeout(() => clearInterval(checkMapRef), 5000);

      } catch (err) {
        setError('Failed to load Google Maps');
        console.error('Google Maps loading error:', err);
      }
    };

    initMap();
  }, []);

  return { mapRef, map, isLoaded, error };
}