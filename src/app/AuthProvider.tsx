'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: number
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (hasMounted) {
      checkAuthStatus()
    }
  }, [hasMounted])

  const checkAuthStatus = async () => {
    // First check if there's a stored auth indicator
    const hasLocalStorage = localStorage.getItem('isLoggedIn') === 'true'
    
    if (!hasLocalStorage) {
      // Skip API call if no auth indicators are present
      // User is not logged in - this is expected, no error needed
      setUser(null)
      setLoading(false)
      return
    }

    // Only make API call if we have evidence of a login
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      // Handle different response statuses
      if (response.ok) {
        const userData = await response.json()
        if (userData.user) {
          setUser(userData.user)
          localStorage.setItem('isLoggedIn', 'true')
        } else {
          setUser(null)
          localStorage.removeItem('isLoggedIn')
        }
      } else {
        // Any non-200 status = not authenticated (clear state silently)
        setUser(null)
        localStorage.removeItem('isLoggedIn')
        
        // Only log if it's an actual server error (500)
        if (response.status === 500) {
          console.warn('Auth server error')
        }
        // Don't log 401 - it's expected when token expires
      }
    } catch (error) {
      // Network error - clear state silently
      setUser(null)
      localStorage.removeItem('isLoggedIn')
    } finally {
      setLoading(false)
    }
  }

  // Don't render children until mounted (prevents hydration issues)
  if (!hasMounted) {
    return null
  }

  const login = async (username: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      if (data.success && data.user) {
        setUser(data.user)
        localStorage.setItem('isLoggedIn', 'true')
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error' }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      // Silently handle logout errors
    } finally {
      // Always clear local state regardless of API response
      setUser(null)
      localStorage.removeItem('isLoggedIn')
      setLoading(false)
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}