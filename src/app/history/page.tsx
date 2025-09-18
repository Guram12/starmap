
import { Metadata } from 'next';
import HistoryClient from './HistoryClient';



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




export default function HistoryPage() {
  return <HistoryClient />;
}