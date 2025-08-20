'use client'

import Link from 'next/link';
import { useAuth } from '../AuthProvider';
import styles from './Header.module.css';
import { useEffect } from 'react';
import { LogOut } from 'lucide-react';



export default function Header() {
  const { user, isAuthenticated, logout, loading } = useAuth();




  useEffect(() => {
    console.log('User authentication status:', isAuthenticated);
  }, [isAuthenticated]);









  
  if (loading) {
    return (
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            StarMap
          </Link>
          <div>Loading...</div>
        </div>
      </header>
    );
  }

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

          {isAuthenticated ? (
            <>
              <span className={styles.user_name}>
               {user?.username}
              </span>
              <button onClick={logout} className={styles.logoutBtn}>
                <LogOut  className={styles.logoutIcon} />
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
        </nav>
      </div>
    </header>
  );
}