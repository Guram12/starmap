import Link from 'next/link';
import styles from './Header.module.css';  // Change this line

export default function Header() {
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
          <Link href="/auth/login" className={styles.navLink}>
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}