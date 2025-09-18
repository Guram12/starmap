import { Metadata } from 'next';
import HistoryClient from './HistoryClient';
import StructuredData from '../StructuredData';



export const metadata: Metadata = {
  title: "Search History - StarMap",
  description: "View and revisit your previous searches. Access your search history to explore places you've searched for.",
  keywords: ["search history", "StarMap history", "previous searches", "explore history"],
  openGraph: {
    title: "Search History - StarMap",
    description: "View and revisit your previous searches. Access your search history to explore places you've searched for.",
    url: "https://starmp.space/history",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Search History - StarMap",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Search History - StarMap",
    description: "View and revisit your previous searches. Access your search history to explore places you've searched for.",
    images: ["/og-image.jpg"],
  },
};

const historyStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Search History - StarMap",
  "description": "View and revisit your previous searches. Access your search history to explore places you've searched for.",
  "url": "https://starmp.space/history",
  "isPartOf": {
    "@type": "WebSite",
    "name": "StarMap",
    "url": "https://starmp.space"
  },
  "mainEntity": {
    "@type": "ItemList",
    "name": "Search History",
    "description": "Previous place searches with results and preferences",
    "numberOfItems": "varies"
  },
  "potentialAction": {
    "@type": "ViewAction",
    "target": "https://starmp.space/history",
    "name": "View Search History"
  }
};

export default function HistoryPage() {
  return (
    <>
      <StructuredData data={historyStructuredData} />
      <HistoryClient />
    </>
  );
}