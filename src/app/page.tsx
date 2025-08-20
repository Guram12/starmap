import Link from "next/link";
import styles from "./page.module.css";

export default function Page() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>🌟 StarMap</h1>
        <p className={styles.description}>
          Welcome to <strong>StarMap</strong>, your guide to discovering the best places based on your preferences.
          Set your criteria and explore the map to find restaurants, hotels, attractions, and more!
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>🗺️ Explore Regions</h3>
            <p>Search for places in your favorite cities or areas.</p>
          </div>
          <div className={styles.feature}>
            <h3>⭐ Filter by Ratings</h3>
            <p>Find only the highest-rated places that meet your standards.</p>
          </div>
          <div className={styles.feature}>
            <h3>📍 Customize Radius</h3>
            <p>Adjust the search radius to find places near you.</p>
          </div>
        </div>

        <div className={styles.ctas}>
          <Link href="/preferences" className={styles.primaryBtn}>
            Set Preferences
          </Link>
          <Link href="/map" className={styles.secondaryBtn}>
            Explore Map
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 StarMap. All rights reserved.</p>
        <nav>
          <Link href="/auth/login">Login</Link>
          <Link href="/auth/register">Register</Link>
          <Link href="/preferences">Preferences</Link>
        </nav>
      </footer>
    </div>
  );
}