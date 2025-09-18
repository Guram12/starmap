import MapClient from './MapClient';
import { Metadata } from 'next';
import StructuredData from '../StructuredData';



export const metadata: Metadata = {
  title: "Interactive Map - StarMap",
  description: "View discovered places on an interactive map. Click markers to see details, ratings, and get directions.",
  keywords: ["interactive map", "places map", "directions", "ratings", "explore places"],
  openGraph: {
    title: "Interactive Map - StarMap",
    description: "View discovered places on an interactive map with ratings and details.",
    url: "https://starmp.space/map",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Interactive Map - StarMap",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Map - StarMap",
    description: "View discovered places on an interactive map with ratings and details.",
    images: ["/og-image.jpg"],
  },
};

const mapStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Interactive Map - StarMap",
  "description": "View discovered places on an interactive map. Click markers to see details, ratings, and get directions.",
  "url": "https://starmp.space/map",
  "isPartOf": {
    "@type": "WebSite",
    "name": "StarMap",
    "url": "https://starmp.space"
  },
  "mainEntity": {
    "@type": "Map",
    "name": "StarMap Interactive Places Map",
    "description": "Interactive map showing restaurants, hotels, and attractions with ratings and details",
    "mapType": "https://schema.org/VenueMap"
  },
  "potentialAction": [
    {
      "@type": "ViewAction",
      "target": "https://starmp.space/map",
      "name": "View Places on Map"
    },
    {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://starmp.space/preferences"
      },
      "name": "Search for Places"
    }
  ]
};

export default function MapPage() {
  return (
    <>
      <StructuredData data={mapStructuredData} />
      <MapClient />
    </>
  );
}