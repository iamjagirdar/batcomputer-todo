import { useState, useEffect } from 'react'
import { AlertTriangle, Loader2, CheckCircle2, ListTodo, ShieldAlert, X } from 'lucide-react'
import { getTodos, createTodo, updateTodo, deleteTodo, uploadVoiceNote } from './api'
import { useAuth } from './context/AuthContext'
import TodoForm    from './components/TodoForm'
import TodoItem    from './components/TodoItem'
import LampToggle  from './components/LampToggle'
import UserProfile from './components/UserProfile'
import LoginPage   from './pages/LoginPage'

/* ── Batman SVG logo ── */
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

/* ── Stat card ── */
function StatCard({ label, value, Icon, accent }) {
  return (
    <div style={{
      flex: 1,
      background: accent ? 'rgba(245,197,24,0.07)' : 'var(--surface)',
      border: `1px solid ${accent ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: 12,
      padding: '14px 8px',
      textAlign: 'center',
      transition: 'background 0.3s, border-color 0.3s',
    }}>
      <Icon size={15} style={{ color: accent ? 'var(--accent)' : 'var(--text-lo)', margin: '0 auto 6px', display: 'block' }} />
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, lineHeight: 1, color: accent ? 'var(--accent)' : 'var(--text-hi)', transition: 'color 0.3s' }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-lo)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 5 }}>
        {label}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   MAIN APP
════════════════════════════════════════════ */
export default function App() {
  const { user, avatar, loading: authLoading } = useAuth()

  const [todos,   setTodos]   = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [filter,  setFilter]  = useState('all')
  const [dark,    setDark]    = useState(true)

  /* Apply theme */
  useEffect(() => {
    document.documentElement.classList.toggle('light', !dark)
  }, [dark])

  /* Fetch todos when user logs in */
  useEffect(() => {
    if (!user) { setTodos([]); return }
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        setTodos(await getTodos())
      } catch {
        setError('Failed to load missions from Batcomputer.')
      } finally {
        setLoading(false)
      }
    })()
  }, [user])

  /* Handlers */
  const handleAdd = async (title, desc) => {
    try {
      const t = await createTodo(title, desc)
      setTodos(p => [t, ...p])
    } catch { setError('Failed to add mission.') }
  }

  const handleVoiceNote = async (audioBlob, title, description) => {
    // Create todo first, then attach voice note
    try {
      const t = await createTodo(title || 'Voice Note', description || null)
      setTodos(p => [{ ...t, has_voice_note: true }, ...p])
      await uploadVoiceNote(t.id, audioBlob)
    } catch { setError('Failed to save voice note.') }
  }

  const handleToggle = async (id, completed) => {
    setTodos(p => p.map(t => t.id === id ? { ...t, completed } : t))
    try { await updateTodo(id, { completed }) }
    catch { setError('Failed to update.') }
  }

  const handleDelete = async (id) => {
    setTodos(p => p.filter(t => t.id !== id))
    try { await deleteTodo(id) }
    catch { setError('Failed to delete.') }
  }

  /* Derived */
  const filtered = todos.filter(t =>
    filter === 'active'    ? !t.completed :
    filter === 'completed' ?  t.completed : true
  )
  const total = todos.length
  const done  = todos.filter(t => t.completed).length
  const pct   = total === 0 ? 0 : Math.round((done / total) * 100)

  /* ── Show login if not authenticated ── */
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <Loader2 size={36} className="spin" style={{ color: 'var(--accent)' }} />
      </div>
    )
  }

  if (!user) return <LoginPage />

  /* ── Main app (authenticated) ── */
  return (
    <>
      <div className="hero-bg" />
      <div className="hero-overlay" />

      <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh' }}>
        <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />

        {/* ── Top bar: lamp + profile ── */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          padding: '0 24px', zIndex: 100, pointerEvents: 'none',
        }}>
          {/* Profile — left */}
          <div style={{ pointerEvents: 'all', paddingTop: 12 }}>
            <UserProfile todoCount={total} doneCount={done} />
          </div>
          {/* Lamp — right */}
          <div style={{ pointerEvents: 'all', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <LampToggle dark={dark} onToggle={() => setDark(d => !d)} />
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '80px 16px 70px' }}>

          {/* ── HEADER ── */}
          <header style={{ textAlign: 'center', marginBottom: 44, position: 'relative' }}>
            <div className="bat-signal-ring" style={{ width: 320, height: 320, top: '50%', left: '50%', marginTop: -160, marginLeft: -160 }} />
            <div className="bat-signal-ring" style={{ width: 220, height: 220, top: '50%', left: '50%', marginTop: -110, marginLeft: -110, animationDelay: '1.5s' }} />

            <div style={{ position: 'relative', marginBottom: 12 }}>
              <img
                src={avatar || "/images/batman-avatar.jpg"}
                alt="Batman"
                style={{
                  width: 100, height: 100, objectFit: 'cover', objectPosition: 'center top',
                  borderRadius: '50%', border: '3px solid var(--accent)',
                  boxShadow: `0 0 ${dark ? '24px' : '16px'} var(--lamp-glow)`,
                  display: 'block', margin: '0 auto',
                  filter: dark ? 'none' : 'saturate(0.7) brightness(1.1)',
                  transition: 'box-shadow 0.3s, filter 0.3s',
                }}
                onError={e => { e.target.style.display = 'none' }}
              />
              <BatLogo style={{
                position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
                width: 48, height: 24, color: 'var(--accent)',
                filter: 'drop-shadow(0 0 6px var(--lamp-glow))',
              }} />
            </div>

            <h1 className="title-flicker" style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 58, letterSpacing: 10,
              color: 'var(--accent)',
              textShadow: dark ? '0 0 40px rgba(245,197,24,0.5), 0 0 80px rgba(245,197,24,0.2)' : '0 2px 4px rgba(0,0,0,0.08)',
              lineHeight: 1, transition: 'text-shadow 0.4s',
            }}>
              BATCOMPUTER
            </h1>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, letterSpacing: 6, color: 'var(--text-lo)', textTransform: 'uppercase', marginTop: 4 }}>
              Welcome back, {user.username} · Gotham City
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, var(--accent))', opacity: 0.3 }} />
              <BatLogo style={{ width: 30, height: 15, color: 'var(--accent)', opacity: 0.6 }} />
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(270deg, transparent, var(--accent))', opacity: 0.3 }} />
            </div>

            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 11, letterSpacing: 3, color: 'var(--text-lo)', marginTop: 10 }}>
              {dark ? '— The Dark Knight —' : '— Bruce Wayne Mode —'}
            </p>
          </header>

          {/* ── ERROR ── */}
          {error && (
            <div className="slide-up" style={{
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 12, padding: '12px 16px', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 24,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertTriangle size={15} color="#ef4444" />
                <span style={{ color: '#ef4444', fontSize: 13 }}>{error}</span>
              </div>
              <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex' }}>
                <X size={14} />
              </button>
            </div>
          )}

          {/* ── STATS ── */}
          {total > 0 && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
              <StatCard label="Total"     value={total}        Icon={ListTodo}    accent={false} />
              <StatCard label="Active"    value={total - done} Icon={ShieldAlert} accent={total - done > 0} />
              <StatCard label="Completed" value={done}         Icon={CheckCircle2} accent={done === total && total > 0} />
            </div>
          )}

          {/* ── PROGRESS ── */}
          {total > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-lo)', marginBottom: 7 }}>
                <span>Mission Progress</span>
                <span style={{ color: 'var(--accent)' }}>{pct}%</span>
              </div>
              <div style={{ height: 6, background: 'var(--surface)', borderRadius: 999, border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div className="prog-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}

          {/* ── FORM ── */}
          <TodoForm onAdd={handleAdd} onVoiceNote={handleVoiceNote} />

          {/* ── FILTERS ── */}
          {total > 0 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
              {['all', 'active', 'completed'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`pill${filter === f ? ' active' : ''}`}>{f}</button>
              ))}
            </div>
          )}

          {/* ── LIST ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {loading && (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <Loader2 size={30} className="spin" style={{ color: 'var(--accent)', margin: '0 auto 14px', display: 'block' }} />
                <p style={{ color: 'var(--text-lo)', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' }}>Accessing Batcomputer...</p>
              </div>
            )}
            {!loading && total === 0 && (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <BatLogo style={{ width: 90, height: 45, color: 'var(--accent)', opacity: 0.1, margin: '0 auto 16px', display: 'block' }} />
                <p style={{ color: 'var(--text-mid)', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase' }}>No Active Missions</p>
                <p style={{ color: 'var(--text-lo)', fontSize: 12, marginTop: 6, fontStyle: 'italic' }}>Gotham is safe... for now.</p>
              </div>
            )}
            {!loading && total > 0 && filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-lo)', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' }}>
                No {filter} missions
              </div>
            )}
            {filtered.map(todo => (
              <TodoItem key={todo.id} todo={todo} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </div>

          {/* ── FOOTER ── */}
          <footer style={{ marginTop: 56, textAlign: 'center' }}>
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', opacity: 0.25, marginBottom: 20 }} />
            <BatLogo style={{ width: 28, height: 14, color: 'var(--accent)', opacity: 0.15, margin: '0 auto 10px', display: 'block' }} />
            <p style={{ color: 'var(--text-lo)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>Python FastAPI · React · Tailwind CSS</p>
            <p style={{ color: 'var(--text-lo)', fontSize: 11, marginTop: 6, fontStyle: 'italic' }}>"I am the night." — Batman</p>
          </footer>
        </div>
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }} />
      </div>
    </>
  )
}
