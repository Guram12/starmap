import MapClient from './MapClient';
import { Metadata } from 'next';



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



export default function MapPage() {
  return <MapClient />;
}
 