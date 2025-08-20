import Link from "next/link";
import styles from "./page.module.css";

export default function Page() {
  return (
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
            <Link href="/map" className={styles.secondaryBtn}>
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
          <h2>Ready to Explore?</h2>
          <p>Join for discovering amazing places</p>
          <Link href="/preferences" className={styles.ctaBtn}>
            Set Your Preferences
          </Link>
        </div>
      </section>
    </div>
  );
}