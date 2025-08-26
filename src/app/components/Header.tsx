'use client'

import Link from 'next/link';
import { useAuth } from '../AuthProvider';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import { useEffect, useRef, useState } from 'react';
import { LogOut } from 'lucide-react';
import { BarLoader } from 'react-spinners';
import Logo from './Logo';



export default function Header() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  // Navigation items
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/preferences', label: 'Preferences' },
    { href: '/map', label: 'Map' },
    { href: '/history', label: 'History' },

  ];

  useEffect(() => {
    console.log('User authentication status:==========?????????????', isAuthenticated);
  }, [isAuthenticated]);

  // Update indicator position when pathname changes
  useEffect(() => {
    const updateIndicator = () => {
      if (!navRef.current) return;

      // Look for active nav item (including auth buttons)
      const activeNavItem = navRef.current.querySelector(`[data-path="${pathname}"]`) as HTMLElement;

      if (activeNavItem) {
        const navRect = navRef.current.getBoundingClientRect();
        const itemRect = activeNavItem.getBoundingClientRect();

        setIndicatorStyle({
          left: itemRect.left - navRect.left,
          width: itemRect.width,
        });
      } else {
        // Hide indicator if no matching nav item
        setIndicatorStyle({ left: 0, width: 0 });
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(updateIndicator, 50);

    // Update on window resize
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [pathname, isAuthenticated]); // Add isAuthenticated dependency

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo_name_cont} >
          <Logo />
          <Link href="/" className={styles.logo}>
            StarMap
          </Link>
        </div>

        <nav className={styles.nav} ref={navRef}>
          <div className={styles.navItems}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
                data-path={item.href}
              >
                {item.label}
              </Link>
            ))}

            {/* Auth buttons with data-path for indicator */}
            {!isAuthenticated && (
              <>
                <Link
                  href="/auth/login"
                  className={`${styles.navLink} ${pathname === '/auth/login' ? styles.active : ''}`}
                  data-path="/auth/login"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className={`${styles.navLink} ${pathname === '/auth/register' ? styles.active : ''}`}
                  data-path="/auth/register"
                >
                  Register
                </Link>
              </>
            )}

            {/* Animated underline indicator */}
            <div
              className={styles.indicator}
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.width > 0 ? 1 : 0, // Hide when width is 0
              }}
            />
          </div>

          {loading ? (
            <div className={styles.loadingSpinner}>
              <BarLoader speedMultiplier={2} />
            </div>
          ) : (
            <>
              {isAuthenticated && (
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
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}