import { Metadata } from "next";
import StructuredData from "./StructuredData";
import MainPageClient from "./MainPageClient";





export const metadata: Metadata = {
  title: "StarMap - Discover Amazing Places",
  description: "Explore restaurants, hotels, and attractions with personalized recommendations based on your preferences and ratings.",
  keywords: ["places finder", "restaurant finder", "hotel search", "tourist attractions", "star ratings"],
  openGraph: {
    title: "StarMap - Discover Amazing Places",
    description: "Explore restaurants, hotels, and attractions with personalized recommendations.",
    url: "https://starmp.space",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "StarMap - Discover Amazing Places",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StarMap - Discover Amazing Places",
    description: "Explore restaurants, hotels, and attractions with personalized recommendations.",
    images: ["/og-image.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "StarMap",
  "description": "Discover restaurants, hotels, and attractions with personalized recommendations based on your preferences and ratings",
  "url": "https://starmp.space",
  "applicationCategory": "TravelApplication",
  "operatingSystem": "Web Browser",
  "browserRequirements": "Requires JavaScript enabled",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "featureList": [
    "Global place discovery",
    "Star rating filtering",
    "Interactive maps",
    "Personalized recommendations",
    "Search history",
    "Location-based search"
  ],
  "creator": {
    "@type": "Organization",
    "name": "StarMap Team"
  },
  "audience": {
    "@type": "Audience",
    "audienceType": "Travelers, Food enthusiasts, Location explorers"
  }
};


export default function Page() {
  return (
    <>
      <StructuredData data={structuredData} />
      <MainPageClient />

    </>

  );
}


