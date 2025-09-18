import Link from "next/link";
import styles from "./page.module.css";
import { Metadata } from "next";
import StructuredData from "./StructuredData";


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

      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              ✨ Discover Amazing Places
            </div>
            <h1 className={styles.heroTitle}>
              Find Your Perfect
              <span className={styles.highlight}> StarMap </span>
              Destination
            </h1>
            <p className={styles.heroSubtitle}>
              Explore restaurants, hotels, and attractions with personalized recommendations
              based on your preferences and ratings.
            </p>
            <div className={styles.heroActions}>
              <Link href="/auth/register" className={styles.primaryBtn}>
                Get Started Free
              </Link>
              <Link href="/preferences" className={styles.secondaryBtn}>
                🗺️ Explore Now
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <div className={styles.iconWrapper}>
              <span className={styles.icon}>💾</span>
            </div>
            <h3>Account Benefits</h3>
            <p>
              <strong>With Registration:</strong> All preferences and search history saved permanently.
              <br />
              <strong>Without Account:</strong> Data stored in browser only - lost on refresh.
            </p>
          </div>
        </section>

        <section className={styles.features}>
          <h2 className={styles.sectionTitle}>Why Choose StarMap?</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🌍</div>
              <h3>Global Search</h3>
              <p>Search any city or region worldwide</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⭐</div>
              <h3>Smart Filtering</h3>
              <p>Filter by ratings, distance, and type</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>Personalized</h3>
              <p>Tailored recommendations just for you</p>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Explore?</h2>
            <p className={styles.ctaSubtitle}>Join for discovering amazing places</p>
            <Link href="/preferences" className={styles.ctaBtn}>
              Set Your Preferences
            </Link>
          </div>
        </section>
      </div>
    </>

  );
}



// CREATE DATABASE starmap_db;
// CREATE USER starmap_user WITH ENCRYPTED PASSWORD 'starmap_password';
// GRANT ALL PRIVILEGES ON DATABASE starmap_db TO starmap_user;







// testing lybraries
// npm install --save-dev jest @testing-library/react @testing-library/jest-dom babel-jest



// FWkiWCjmUJUgqz14Sv4ssXwF