import { useState } from 'react'
import { Check, X } from 'lucide-react'
import VoiceNote from './VoiceNote'
import { deleteVoiceNote } from '../api'

export default function TodoItem({ todo, onToggle, onDelete }) {
  const [hasVoice, setHasVoice] = useState(todo.has_voice_note)

  const handleDeleteVoice = async () => {
    try {
      await deleteVoiceNote(todo.id)
      setHasVoice(false)
    } catch { /* silent */ }
  }

  return (
    <div
      className="card slide-up"
      style={{
        padding: '14px 16px',
        opacity: todo.completed ? 0.45 : 1,
        transition: 'opacity 0.3s',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>

        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo.id, !todo.completed)}
          aria-label="Toggle"
          style={{
            flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
            border: `2px solid ${todo.completed ? 'var(--accent)' : 'var(--border)'}`,
            background: todo.completed ? 'var(--accent)' : 'transparent',
            color: '#000', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', marginTop: 2,
          }}
        >
          {todo.completed && <Check size={12} strokeWidth={3} />}
        </button>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontWeight: 600, fontSize: 15,
            color: todo.completed ? 'var(--text-lo)' : 'var(--text-hi)',
            textDecoration: todo.completed ? 'line-through' : 'none',
            wordBreak: 'break-word', transition: 'color 0.3s',
          }}>
            {todo.title}
          </p>
          {todo.description && (
            <p style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: 3, wordBreak: 'break-word' }}>
              {todo.description}
            </p>
          )}
        </div>

        {/* Badge */}
        <span style={{
          flexShrink: 0, alignSelf: 'flex-start', marginTop: 2,
          fontSize: 10, letterSpacing: 1.5, fontFamily: "'Bebas Neue', sans-serif",
          padding: '2px 8px', borderRadius: 6,
          border: `1px solid ${todo.completed ? 'var(--accent)' : 'var(--border)'}`,
          color: todo.completed ? 'var(--accent)' : 'var(--text-lo)',
          background: todo.completed ? 'rgba(245,197,24,0.08)' : 'transparent',
          transition: 'all 0.3s',
        }}>
          {todo.completed ? 'DONE' : 'OPEN'}
        </span>

        {/* Delete todo */}
        <button
          onClick={() => onDelete(todo.id)}
          aria-label="Delete"
          style={{
            flexShrink: 0, background: 'none', border: 'none',
            color: 'var(--text-lo)', cursor: 'pointer',
            display: 'flex', borderRadius: 6, padding: 4, transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-lo)'}
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Voice note player — shows below if voice note exists */}
      {hasVoice && (
        <div style={{ marginTop: 10, paddingLeft: 36 }}>
          <VoiceNote todoId={todo.id} onDelete={handleDeleteVoice} />
        </div>
      )}
    </div>
  )
}
