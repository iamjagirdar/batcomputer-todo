import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(null)
  const [avatar,  setAvatarState] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on app load
  useEffect(() => {
    const savedToken  = localStorage.getItem('bat_token')
    const savedUser   = localStorage.getItem('bat_user')
    const savedAvatar = localStorage.getItem('bat_avatar')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    if (savedAvatar) setAvatarState(savedAvatar)
    setLoading(false)
  }, [])

  const saveSession = (tokenVal, userVal) => {
    setToken(tokenVal)
    setUser(userVal)
    localStorage.setItem('bat_token', tokenVal)
    localStorage.setItem('bat_user', JSON.stringify(userVal))
  }

  const login = async (email, password) => {
    const data = await loginUser(email, password)
    saveSession(data.access_token, data.user)
    return data.user
  }

  const register = async (username, email, password) => {
    const data = await registerUser(username, email, password)
    saveSession(data.access_token, data.user)
    return data.user
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setAvatarState(null)
    localStorage.removeItem('bat_token')
    localStorage.removeItem('bat_user')
    localStorage.removeItem('bat_avatar')
  }

  // Called after successful avatar upload
  const setAvatar = (dataUrl) => {
    setAvatarState(dataUrl)
    if (dataUrl) {
      localStorage.setItem('bat_avatar', dataUrl)
    } else {
      localStorage.removeItem('bat_avatar')
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, avatar, setAvatar, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
