'use client'

import Link from 'next/link';
import { useAuth } from '../AuthProvider';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import { useEffect, useRef, useState } from 'react';
import { LogOut } from 'lucide-react';
import { BarLoader } from 'react-spinners';
import Logo from './Logo';
import { Menu } from 'lucide-react';
import useIsMobile from '@/hooks/useIsMobile';
import { motion, AnimatePresence } from 'framer-motion';
import { House } from 'lucide-react';
import { Settings } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { History } from 'lucide-react';
import { KeyRound } from 'lucide-react';
import { UserRoundPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GoDotFill } from "react-icons/go";


export default function Header() {


  const [websiteLoaded, setWebsiteLoaded] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const { user, isAuthenticated, logout, loading } = useAuth();
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });


  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState<boolean>(false);
  const isMobile = useIsMobile(768);

  const router = useRouter();


  const handlerBurgerMenuClick = () => {
    setIsBurgerMenuOpen(!isBurgerMenuOpen);
  }

  useEffect(() => {
    const overlay = document.getElementById('mobile-menu-overlay');
    if (overlay) {
      if (isBurgerMenuOpen) {
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
        overlay.style.pointerEvents = 'auto';
        overlay.onclick = () => setIsBurgerMenuOpen(false);
      } else {
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        overlay.style.pointerEvents = 'none';
        overlay.onclick = null;
      }
    }
  }, [isBurgerMenuOpen]);

  // ----------------------------------------
  useEffect(() => {
    if (!isMobile) {
      setIsBurgerMenuOpen(false);
    }
  }, [isMobile])
  // ----------------------------------------

  useEffect(() => {
    setWebsiteLoaded(true);
  }, []);
  // ================================================= Navigation items ====================================================
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/preferences', label: 'Preferences' },
    { href: '/map', label: 'Map' },
    { href: '/history', label: 'History' },

  ];


  const [burgerMenuItems, setBurgerMenuItems] = useState([
    { href: '/', label: 'Home' },
    { href: '/preferences', label: 'Preferences' },
    { href: '/map', label: 'Map' },
    { href: '/history', label: 'History' },
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      setBurgerMenuItems([
        { href: '/', label: 'Home' },
        { href: '/preferences', label: 'Preferences' },
        { href: '/map', label: 'Map' },
        { href: '/history', label: 'History' },
        { href: '/auth/login', label: 'Login' },
        { href: '/auth/register', label: 'Register' },
      ]);
      setIsBurgerMenuOpen(false);
    } else {
      setBurgerMenuItems([
        { href: '/', label: 'Home' },
        { href: '/preferences', label: 'Preferences' },
        { href: '/map', label: 'Map' },
        { href: '/history', label: 'History' },
      ]);
      setIsBurgerMenuOpen(false);
    }

  }, [isAuthenticated]);
  // ======================================================= render burger icons ============================================


  const renderBurgerIcon = (href: string) => {
    switch (href) {
      case '/':
        return <House className={styles.burgermenu_icons} />;
      case '/preferences':
        return <Settings className={styles.burgermenu_icons} />;
      case '/map':
        return <MapPin className={styles.burgermenu_icons} />;
      case '/history':
        return <History className={styles.burgermenu_icons} />;
      case '/auth/login':
        return <KeyRound className={styles.burgermenu_icons} />;
      case '/auth/register':
        return <UserRoundPlus className={styles.burgermenu_icons} />;
    }
  }


  const handle_burger_page_click = (href: string) => {
    setIsBurgerMenuOpen(false);
    router.push(href);

  }


  // ================================================== scroll effect ======================================================


  useEffect(() => {
    if (pathname !== '/map') {
      setScrolled(false);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);



  //=================================== Update indicator position when pathname changes ====================================
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
  }, [pathname, isAuthenticated]);



  // ================================================== JSX ======================================================
  return (
    <motion.header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: '-150%', x: '-50%' }}
      animate={websiteLoaded ? { y: ['-100%', '50%', '0%'] } : {}}
      transition={{
        type: "keyframes",
        stiffness: 500,
        damping: 20,
        mass: 0.6,
        duration: 0.5
      }}
    >
      <div className={styles.container}>
        <div className={styles.logo_name_cont}>
          <Logo />
          <Link href="/" className={styles.logo}>
            StarMap
          </Link>
        </div>

        <nav className={styles.nav} ref={navRef}>

          {isMobile ?
            (
              <>
                <Menu
                  style={{
                    cursor: 'pointer',
                    color: '#000',
                    width: '30px',
                    height: '30px',
                    fontSize: '24px',
                  }}
                  onClick={handlerBurgerMenuClick}
                />

                <AnimatePresence>
                  {isBurgerMenuOpen && (
                    <motion.div
                      className={styles.burgerMenu}
                      initial={{
                        clipPath: "inset(10% 50% 90% 50% round 10px)",
                        opacity: 0
                      }}
                      animate={{
                        clipPath: "inset(0% 0% 0% 0% round 10px)",
                        opacity: 1
                      }}
                      exit={{
                        clipPath: "inset(10% 50% 90% 50% round 10px)",
                        opacity: 0
                      }}

                      style={{
                        left: '50%',
                        transform: 'translateX(-50%)'
                      }}
                      transition={{
                        type: "spring",
                        bounce: 0,
                        duration: 0.5,
                        delayChildren: 0.3,
                        staggerChildren: 0.1
                      }}
                    >
                      <div className={styles.navItemsMobile}>
                        {burgerMenuItems.map((item, index) => (
                          <motion.div
                            className={styles.nav_button_with_icon}
                            key={item.href}
                            onClick={() => handle_burger_page_click(item.href)}
                            initial={{
                              opacity: 0,
                              scale: 0.3,
                              filter: "blur(20px)"
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              filter: "blur(0px)"
                            }}
                            exit={{
                              opacity: 0,
                              scale: 0.3,
                              filter: "blur(20px)"
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 24,
                              delay: index * 0.04
                            }}
                          >
                            {renderBurgerIcon(item.href)}
                            <Link
                              href={item.href}
                              className={`${styles.navLink_mobile} ${pathname === item.href ? styles.active : ''}`}
                              data-path={item.href}
                            >
                              {item.label}
                            </Link>

                            {/* active page indicator dot icon */}
                            {pathname === item.href && (
                              <GoDotFill
                                style={{
                                  position: 'absolute',
                                  right: '10px',
                                  top: '7px',
                                  color: 'black',
                                  width: '25px',
                                  height: '25px',
                                  zIndex: 10,
                                }}
                              />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>


                  )}
                </AnimatePresence>

              </>

            ) : (
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

            )}



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
    </motion.header>
  );
}