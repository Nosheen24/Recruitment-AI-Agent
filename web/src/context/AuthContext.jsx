import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(() => localStorage.getItem('auth_token'))
  const [loading, setLoading] = useState(!!localStorage.getItem('auth_token'))

  // Validate stored token on startup
  useEffect(() => {
    if (!token) { setLoading(false); return }
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(u => setUser(u))
      .catch(() => { localStorage.removeItem('auth_token'); setToken(null) })
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const _storeSession = (access_token, u) => {
    localStorage.setItem('auth_token', access_token)
    setToken(access_token)
    setUser(u)
  }

  const login = useCallback(async (email, password) => {
    const fd = new FormData()
    fd.append('username', email)
    fd.append('password', password)
    const res = await fetch('/api/auth/login', { method: 'POST', body: fd })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || 'Login failed')
    }
    const { access_token, user: u } = await res.json()
    _storeSession(access_token, u)
    return u
  }, [])

  const register = useCallback(async (name, email, password) => {
    const res = await fetch('/api/auth/register', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, password }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || 'Registration failed')
    }
    const { access_token, user: u } = await res.json()
    _storeSession(access_token, u)
    return u
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token')
    setToken(null)
    setUser(null)
  }, [])

  // Authenticated fetch — automatically adds Bearer token
  const authFetch = useCallback((url, options = {}) => {
    const headers = { ...(options.headers || {}) }
    if (token) headers['Authorization'] = `Bearer ${token}`
    return fetch(url, { ...options, headers })
  }, [token])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register, authFetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
