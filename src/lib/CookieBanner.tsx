'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CookieBanner.module.css';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setTimeout(() => {
        setShowBanner(true);
      }, 1500);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0, x: '-50%' }}
          animate={{ y: 0, opacity: 1, x: '-50%' }}
          exit={{ y: 100, opacity: 0, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className={styles.banner}
          style={{ left: '50%', position: 'fixed', bottom: 40 }}
        >
          <div className={styles.content}>
            <div className={styles.textContainer}>
              <p className={styles.text}>
                <span className={styles.emoji}>🍪</span>
                This website uses cookies to enhance your experience and provide secure authentication.
                By continuing to use our site, you agree to our use of cookies.
              </p>
            </div>
            <button
              onClick={acceptCookies}
              className={styles.button}
            >
              Accept Cookies
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}