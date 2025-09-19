import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { AuthProvider } from "./AuthProvider";
import CookieBanner from "@/lib/CookieBanner";
import Script from 'next/script';





const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: "StarMap - Find Your Perfect Places with Star Ratings",
    template: "%s | StarMap"
  },
  description: "Discover restaurants, hotels, tourist attractions and more based on star ratings and location preferences. Search globally with personalized recommendations.",
  keywords: [
    "places finder",
    "restaurant finder",
    "hotel search",
    "tourist attractions",
    "star ratings",
    "location search",
    "travel recommendations",
    "maps",
    "places discovery"
  ],
  authors: [{ name: "StarMap Team" }],
  creator: "StarMap",
  publisher: "StarMap",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'StarMap - Find Your Perfect Places',
    description: 'Discover amazing places based on star ratings and preferences',
    siteName: 'StarMap',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'StarMap - Places Discovery Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StarMap - Find Your Perfect Places',
    description: 'Discover amazing places based on star ratings and preferences',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/starmap_logo.svg" />
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <Header />
          {children}
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  );
}