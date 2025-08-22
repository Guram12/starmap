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
          libraries: ['places', 'geometry'] // Remove 'marker' library - it's expensive
        });

        const { Map } = await loader.importLibrary('maps') as google.maps.MapsLibrary;

        if (mapRef.current) {
          const mapInstance = new Map(mapRef.current, {
            center: options.center || { lat: 40.7128, lng: -74.0060 },
            zoom: options.zoom || 12,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
          });

          setMap(mapInstance);
          setIsLoaded(true);
        }
      } catch (err) {
        setError('Failed to load Google Maps');
        console.error('Google Maps loading error:', err);
      }
    };

    initMap();
  }, [options.center, options.zoom]);

  return { mapRef, map, isLoaded, error };
}