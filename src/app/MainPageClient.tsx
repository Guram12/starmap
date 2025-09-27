'use client';

import Link from "next/link";
import styles from "./page.module.css";
import { motion } from "framer-motion";


export default function MainPageClient() {





  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className={styles.heroContent}>
          <motion.div
            className={styles.badge}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            ✨ Discover Amazing Places
          </motion.div>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Find Your Perfect
            <span className={styles.highlight}> StarMap </span>
            Destination
          </motion.h1>
          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            Explore restaurants, hotels, and attractions with personalized recommendations
            based on your preferences and ratings.
          </motion.p>
          <motion.div
            className={styles.heroActions}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/auth/register" className={styles.primaryBtn}>
                Get Started Free
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/preferences" className={styles.secondaryBtn}>
                🗺️ Explore Now
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className={styles.infoSection}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <motion.div
          className={styles.infoCard}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className={styles.iconWrapper}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, duration: 0.3, type: "spring" }}
          >
            <span className={styles.icon}>💾</span>
          </motion.div>
          <h3>Account Benefits</h3>
          <p>
            <strong>With Registration:</strong> All preferences and search history saved permanently.
            <br />
            <strong>Without Account:</strong> Data stored in browser only - lost on refresh.
          </p>
        </motion.div>
      </motion.section>

      <motion.section
        className={styles.features}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.4 }}
      >
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.3 }}
        >
          Why Choose StarMap?
        </motion.h2>
        <div className={styles.featureGrid}>
          <motion.div
            className={styles.featureCard}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.3 }}
            whileHover={{
              scale: 1.05
            }}
          >
            <div className={styles.featureIcon}>🌍</div>
            <h3>Global Search</h3>
            <p>Search any city or region worldwide</p>
          </motion.div>
          <motion.div
            className={styles.featureCard}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.3 }}
            whileHover={{
              scale: 1.05
            }}
          >
            <div className={styles.featureIcon}>⭐</div>
            <h3>Smart Filtering</h3>
            <p>Filter by ratings, distance, and type</p>
          </motion.div>
          <motion.div
            className={styles.featureCard}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, duration: 0.3 }}
            whileHover={{
              scale: 1.05
            }}
          >
            <div className={styles.featureIcon}>🎯</div>
            <h3>Personalized</h3>
            <p>Tailored recommendations just for you</p>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className={styles.cta}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.4 }}
      >
        <motion.div
          className={styles.ctaContent}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.3 }}
        >
          <motion.h2
            className={styles.ctaTitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.25 }}
          >
            Ready to Explore?
          </motion.h2>
          <motion.p
            className={styles.ctaSubtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.65, duration: 0.25 }}
          >
            Join for discovering amazing places
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.25 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/preferences" className={styles.ctaBtn}>
              Set Your Preferences
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </motion.div>

  );
}



// CREATE DATABASE starmap_db;
// CREATE USER starmap_user WITH ENCRYPTED PASSWORD 'starmap_password';
// GRANT ALL PRIVILEGES ON DATABASE starmap_db TO starmap_user;







// testing lybraries
// npm install --save-dev jest @testing-library/react @testing-library/jest-dom babel-jest



// FWkiWCjmUJUgqz14Sv4ssXwF