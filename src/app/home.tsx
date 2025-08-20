import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>🌟 StarMap</h1>
        <p className={styles.description}>
          Explore the universe of open-source projects.
        </p>

      </main>
    </div>
  );
}