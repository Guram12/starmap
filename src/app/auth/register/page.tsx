'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/AuthProvider'
import styles from './Register.module.css'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth() // Get login function from context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // 🚀 NEW: Auto-login after successful registration
        if (data.autoLogin && data.user) {
          // Update auth context
          await login(formData.username, formData.password)
          // Redirect to map or home
          router.push('/map?welcome=true') // Optional welcome parameter
        } else {
          // Fallback: redirect to login
          router.push('/auth/login?message=Registration successful! Please login.')
        }
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (_error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.registerPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Join StarMap</h1>
        <p className={styles.subtitle}>Create your account to get started</p>
        
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Your existing form fields */}
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
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
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
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
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
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
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
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account & Sign In'}
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
  )
}