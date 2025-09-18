import { Metadata } from "next";
import PreferencesClient from './PreferencesClient';
import StructuredData from "../StructuredData";




export const metadata: Metadata = {
  title: "Set Your Preferences - StarMap",
  description: "Customize your search criteria to find the perfect places. Set location, place type, minimum star ratings, and search radius.",
  keywords: ["preferences", "custom search", "place types", "star ratings", "search radius"],
  openGraph: {
    title: "Set Your Preferences - StarMap",
    description: "Customize your search criteria to find the perfect places.",
    url: "https://starmp.space/preferences",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Set Your Preferences - StarMap",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Set Your Preferences - StarMap",
    description: "Customize your search criteria to find the perfect places.",
    images: ["/og-image.jpg"],
  },
};

const preferencesStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Set Your Preferences - StarMap",
  "description": "Customize your search criteria to find the perfect places. Set location, place type, minimum star ratings, and search radius.",
  "url": "https://starmp.space/preferences",
  "isPartOf": {
    "@type": "WebSite",
    "name": "StarMap",
    "url": "https://starmp.space"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://starmp.space/map?region={search_term}"
    },
    "query-input": "required name=search_term"
  },
  "mainEntity": {
    "@type": "SoftwareApplication",
    "name": "StarMap Preferences",
    "applicationCategory": "TravelApplication",
    "operatingSystem": "Web Browser"
  }
};

export default function Preferences() {
  return (
    <>
      <StructuredData data={preferencesStructuredData} />
      <PreferencesClient />
    </>
  );
}