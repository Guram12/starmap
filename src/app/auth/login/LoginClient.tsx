'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import styles from './Login.module.css'
import { useAuth } from '@/app/AuthProvider'

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await login(formData.username, formData.password)

      if (result.success) {
        router.push('/map')
      } else {
        setError(result.error || 'Login failed')
      }
    } catch (_error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginPage}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          mass: 0.8,
          duration: 0.6
        }}
      >
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Welcome Back
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Sign in to your StarMap account
        </motion.p>

        {error && (
          <motion.div
            className={styles.error}
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {error}
          </motion.div>
        )}

        <motion.form
          className={styles.form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.div
            className={styles.field}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <label htmlFor="username" className={styles.label}>
              Username or Email
            </label>
            <input
              id="username"
              type="text"
              name="username"
              className={styles.input}
              placeholder="Enter your username or email"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </motion.div>

          <motion.div
            className={styles.field}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className={styles.input}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </motion.button>
        </motion.form>

        <motion.div
          className={styles.footer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className={styles.registerLink}>
              Register here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}