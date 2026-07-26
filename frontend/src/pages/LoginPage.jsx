import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User, Eye, EyeOff, Zap, AlertTriangle } from 'lucide-react'

function BatLogo({ style = {} }) {
  return (
    <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" style={style} aria-hidden="true">
      <path fill="currentColor"
        d="M100 18 C78 18 58 29 47 46 C37 29 16 23 7 34
           C1 40 7 57 24 57 C13 57 7 68 18 73
           C30 78 46 67 51 56 C57 72 67 82 82 82
           C87 87 93 90 100 90 C107 90 113 87 118 82
           C133 82 143 72 149 56 C154 67 170 78 182 73
           C193 68 187 57 176 57 C193 57 199 40 193 34
           C184 23 163 29 153 46 C142 29 122 18 100 18Z"
      />
    </svg>
  )
}

export default function LoginPage() {
  const { login, register } = useAuth()

  const [mode, setMode]           = useState('login')   // 'login' | 'register'
  const [waking, setWaking]       = useState(false)
  const [username, setUsername]   = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [shake, setShake]         = useState(false)

  // Ping backend on mount to wake it from Render sleep
  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    setWaking(true)
    fetch(`${BASE_URL}/ping`)
      .finally(() => setWaking(false))
  }, [])

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(username, email, password)
      }
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Something went wrong. Try again.'
      setError(msg)
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login')
    setError(null)
    setUsername('')
    setEmail('')
    setPassword('')
  }

  return (
    <div className="login-page">
      {/* ── Animated background particles ── */}
      <div className="login-bg">
        <div className="login-bg-image" />
        <div className="login-bg-overlay" />
        {/* Floating bat signals */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bat-float" style={{ animationDelay: `${i * 2}s`, left: `${20 + i * 30}%` }}>
            <BatLogo style={{ width: 40, height: 20, color: 'var(--accent)', opacity: 0.06 }} />
          </div>
        ))}
      </div>

      {/* ── Login card ── */}
      <div className={`login-card ${shake ? 'shake' : ''}`}>

        {/* Header */}
        <div className="login-header">
          {/* Bat signal rings */}
          <div className="login-ring" style={{ width: 180, height: 180, marginTop: -90, marginLeft: -90 }} />
          <div className="login-ring" style={{ width: 120, height: 120, marginTop: -60, marginLeft: -60, animationDelay: '1s' }} />

          <img
            src="/images/batman-avatar.jpg"
            alt="Batman"
            className="login-avatar"
            onError={e => e.target.style.display = 'none'}
          />
          <BatLogo style={{ width: 60, height: 30, color: 'var(--accent)', margin: '10px auto 0', display: 'block', filter: 'drop-shadow(0 0 8px rgba(245,197,24,0.6))' }} />
          <h1 className="login-title">BATCOMPUTER</h1>
          <p className="login-subtitle">
            {waking ? '⚡ Waking up Batcomputer...' : mode === 'login' ? 'Access Granted to Authorized Personnel' : 'Join the Dark Knight\'s Network'}
          </p>
        </div>

        {/* Mode tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(null) }}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`login-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(null) }}
            type="button"
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">

          {/* Error banner */}
          {error && (
            <div className="login-error">
              <AlertTriangle size={14} />
              <span>{error}</span>
            </div>
          )}

          {/* Username — register only */}
          {mode === 'register' && (
            <div className="login-field">
              <User size={16} className="login-field-icon" />
              <input
                type="text"
                placeholder="Choose your alias..."
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                minLength={2}
                className="login-input"
                autoComplete="username"
              />
              <span className="login-field-line" />
            </div>
          )}

          {/* Email */}
          <div className="login-field">
            <Mail size={16} className="login-field-icon" />
            <input
              type="email"
              placeholder="Your secure email..."
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="login-input"
              autoComplete="email"
            />
            <span className="login-field-line" />
          </div>

          {/* Password */}
          <div className="login-field">
            <Lock size={16} className="login-field-icon" />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder={mode === 'register' ? 'Create a password (min 6)...' : 'Enter password...'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="login-input"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            <button
              type="button"
              onClick={() => setShowPass(s => !s)}
              className="login-eye"
              aria-label="Toggle password visibility"
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <span className="login-field-line" />
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? (
              <span className="login-btn-loading">
                <span className="login-spinner" />
                {mode === 'login' ? 'AUTHENTICATING...' : 'CREATING ACCOUNT...'}
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Zap size={16} />
                {mode === 'login' ? 'ACCESS BATCOMPUTER' : 'JOIN THE NETWORK'}
              </span>
            )}
          </button>

          {/* Switch mode link */}
          <p className="login-switch">
            {mode === 'login' ? "New to Gotham? " : "Already have access? "}
            <button type="button" onClick={switchMode} className="login-switch-btn">
              {mode === 'login' ? 'Create Account' : 'Sign In'}
            </button>
          </p>

        </form>

        {/* Footer */}
        <p className="login-footer-text">
          "The night is darkest just before the dawn." — Batman
        </p>
      </div>
    </div>
  )
}
