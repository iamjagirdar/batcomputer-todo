import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser } from '../api'

// ── Create the context ────────────────────────────────────────
const AuthContext = createContext(null)

// ── Provider wraps the whole app ──────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)   // { id, username, email }
  const [token, setToken]   = useState(null)
  const [loading, setLoading] = useState(true)  // checking localStorage on boot

  // On app load — restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('bat_token')
    const savedUser  = localStorage.getItem('bat_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const data = await loginUser(email, password)
    setToken(data.access_token)
    setUser(data.user)
    localStorage.setItem('bat_token', data.access_token)
    localStorage.setItem('bat_user', JSON.stringify(data.user))
    return data.user
  }

  const register = async (username, email, password) => {
    const data = await registerUser(username, email, password)
    setToken(data.access_token)
    setUser(data.user)
    localStorage.setItem('bat_token', data.access_token)
    localStorage.setItem('bat_user', JSON.stringify(data.user))
    return data.user
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('bat_token')
    localStorage.removeItem('bat_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Custom hook — use this in any component ───────────────────
export function useAuth() {
  return useContext(AuthContext)
}
