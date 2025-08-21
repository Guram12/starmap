'use client'

import Link from 'next/link';
import { useAuth } from '../AuthProvider';
import styles from './Header.module.css';
import { useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { BarLoader } from 'react-spinners';


export default function Header() {
  const { user, isAuthenticated, logout, loading } = useAuth();

  useEffect(() => {
    console.log('User authentication status:', isAuthenticated);
  }, [isAuthenticated]);



  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          StarMap
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/preferences" className={styles.navLink}>
            Preferences
          </Link>
          <Link href="/map" className={styles.navLink}>
            Map
          </Link>

          {loading ? (
            <div className={styles.loadingSpinner}>
              <BarLoader speedMultiplier={2}
              />
            </div>
          ) : (
            <>
              {isAuthenticated ? (
                <>
                  <div className={styles.userSection}>
                    <div className={styles.avatar}>
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <button onClick={logout} className={styles.logoutBtn}>
                    <LogOut className={styles.logout_Icon} />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className={styles.navLink}>
                    Login
                  </Link>
                  <Link href="/auth/register" className={styles.navLink}>
                    Register
                  </Link>
                </>
              )}
            </>
          )}


        </nav>
      </div>
    </header>
  );
}