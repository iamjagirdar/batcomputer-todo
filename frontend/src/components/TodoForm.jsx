import { useState } from 'react'
import { Zap, AlignLeft, Plus } from 'lucide-react'

function TodoForm({ onAdd }) {
  const [title, setTitle]       = useState('')
  const [description, setDesc]  = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim(), description.trim() || null)
    setTitle('')
    setDesc('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="card p-5">

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <Zap size={17} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="New mission for Gotham..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="input-line"
            required
          />
        </div>

        {/* Description */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingLeft: 2 }}>
          <AlignLeft size={14} style={{ color: 'var(--text-lo)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Details (optional)"
            value={description}
            onChange={e => setDesc(e.target.value)}
            className="input-sub"
          />
        </div>

        {/* Submit */}
        <button type="submit" disabled={!title.trim()} className="deploy-btn">
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Plus size={15} strokeWidth={3} />
            DEPLOY MISSION
          </span>
        </button>
      </div>
    </form>
  )
}

export default TodoForm
