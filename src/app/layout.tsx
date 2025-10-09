import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { AuthProvider } from "./AuthProvider";
import CookieBanner from "@/lib/CookieBanner";
// import { Analytics } from '@vercel/analytics/react';
// import { SpeedInsights } from '@vercel/speed-insights/next';





const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
  colorScheme: 'light dark',
}

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
    "places discovery",
    "local business",
    "reviews",
    "recommendations"
  ],
  authors: [{ name: "StarMap Team" }],
  creator: "StarMap",
  publisher: "StarMap",
  category: 'travel',
  classification: 'Business',
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
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
    },
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'mobile-web-app-capable': 'yes',
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
        <link rel="apple-touch-icon" href="/starmap_logo.svg" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "StarMap",
              "description": "Discover restaurants, hotels, tourist attractions and more based on star ratings and location preferences",
              "url": process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
              "applicationCategory": "TravelApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "1000+"
              }
            })
          }}
        />
        
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
                  gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                    send_page_view: true
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div
          id="mobile-menu-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            zIndex: 98,
            pointerEvents: 'none',
            transition: 'background-color 0.3s ease'
          }}
        />
        <div
          id="mobile-menu-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            zIndex: 98,
            pointerEvents: 'none',
            transition: 'background-color 0.3s ease'
          }}
        />
        <AuthProvider>
          <Header />
          {children}
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  );
}