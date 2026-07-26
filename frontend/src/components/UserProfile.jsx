import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Mail, LogOut, Shield, X, ChevronDown } from 'lucide-react'

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

export default function UserProfile({ todoCount = 0, doneCount = 0 }) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  if (!user) return null

  // Generate initials avatar color from username
  const initials = user.username.slice(0, 2).toUpperCase()

  return (
    <div style={{ position: 'relative' }}>

      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="profile-trigger"
        aria-label="Open profile"
      >
        <div className="profile-avatar-small">
          {initials}
        </div>
        <span className="profile-trigger-name">{user.username}</span>
        <ChevronDown size={14} style={{
          color: 'var(--text-lo)',
          transition: 'transform 0.2s',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
        }} />
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="profile-panel slide-up">

            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="profile-close"
              aria-label="Close"
            >
              <X size={14} />
            </button>

            {/* Avatar + name */}
            <div style={{ textAlign: 'center', paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
              <div className="profile-avatar-large">
                {initials}
                <BatLogo style={{
                  position: 'absolute',
                  bottom: -4,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 32,
                  height: 16,
                  color: 'var(--accent)',
                }} />
              </div>
              <h3 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 22,
                letterSpacing: 3,
                color: 'var(--text-hi)',
                marginTop: 12,
              }}>
                {user.username}
              </h3>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: 'rgba(245,197,24,0.08)',
                border: '1px solid rgba(245,197,24,0.2)',
                borderRadius: 20,
                padding: '3px 10px',
                marginTop: 6,
              }}>
                <Shield size={10} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: 10, letterSpacing: 2, color: 'var(--accent)', fontFamily: "'Bebas Neue', sans-serif" }}>
                  GOTHAM OPERATIVE
                </span>
              </div>
            </div>

            {/* Info rows */}
            <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="profile-info-row">
                <User size={13} style={{ color: 'var(--accent)' }} />
                <div>
                  <p style={{ fontSize: 10, letterSpacing: 1, color: 'var(--text-lo)', textTransform: 'uppercase' }}>Username</p>
                  <p style={{ fontSize: 14, color: 'var(--text-hi)', fontWeight: 600 }}>{user.username}</p>
                </div>
              </div>
              <div className="profile-info-row">
                <Mail size={13} style={{ color: 'var(--accent)' }} />
                <div>
                  <p style={{ fontSize: 10, letterSpacing: 1, color: 'var(--text-lo)', textTransform: 'uppercase' }}>Email</p>
                  <p style={{ fontSize: 14, color: 'var(--text-hi)', fontWeight: 600 }}>{user.email}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 8, padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
              <div className="profile-stat">
                <span className="profile-stat-value">{todoCount}</span>
                <span className="profile-stat-label">Total</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value" style={{ color: 'var(--accent)' }}>{todoCount - doneCount}</span>
                <span className="profile-stat-label">Active</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">{doneCount}</span>
                <span className="profile-stat-label">Done</span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => { logout(); setOpen(false) }}
              className="profile-logout-btn"
            >
              <LogOut size={14} />
              Sign Out of Batcomputer
            </button>

          </div>
        </>
      )}
    </div>
  )
}
