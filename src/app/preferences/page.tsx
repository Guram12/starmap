import { Metadata } from "next";
import PreferencesClient from './PreferencesClient';



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



export default function Preferences() {
  return <PreferencesClient />;
}