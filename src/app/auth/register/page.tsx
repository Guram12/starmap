import Link from 'next/link';
import styles from './Register.module.css';

export default function Register() {
  return (
    <div className={styles.registerPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Join StarMap</h1>
        <p className={styles.subtitle}>Create your account to get started</p>
        
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
              placeholder="Choose a username"
              required 
            />
          </div>
          
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input 
              id="email"
              type="email" 
              name="email" 
              className={styles.input}
              placeholder="Enter your email"
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
              placeholder="Create a password"
              required 
            />
          </div>
          
          <div className={styles.field}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password
            </label>
            <input 
              id="confirmPassword"
              type="password" 
              name="confirmPassword" 
              className={styles.input}
              placeholder="Confirm your password"
              required 
            />
          </div>
          
          <button type="submit" className={styles.submitBtn}>
            Create Account
          </button>
        </form>
        
        <div className={styles.footer}>
          <p>
            Already have an account?{' '}
            <Link href="/auth/login" className={styles.loginLink}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}