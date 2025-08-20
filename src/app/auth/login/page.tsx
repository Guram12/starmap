import Link from 'next/link';
import styles from './Login.module.css';

export default function Login() { 
  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your StarMap account</p>
        
        <form className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input 
              id="username"
              type="text" 
              name="username" 
              className={styles.input}
              placeholder="Enter your username"
              required 
            />
          </div>
          
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input 
              id="password"
              type="password" 
              name="password" 
              className={styles.input}
              placeholder="Enter your password"
              required 
            />
          </div>
          
          <button type="submit" className={styles.submitBtn}>
            Sign In
          </button>
        </form>
        
        <div className={styles.footer}>
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className={styles.registerLink}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}