import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Loader2, Trash2 } from 'lucide-react'

function formatTime(s) {
  if (!s || isNaN(s) || !isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function VoiceNote({ todoId, onDelete }) {
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(false)
  const [playing,  setPlaying]  = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [current,  setCurrent]  = useState(0)

  const audioRef = useRef(null)
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  useEffect(() => {
    const token = localStorage.getItem('bat_token')
    if (!token) { setError(true); setLoading(false); return }

    fetch(`${BASE_URL}/todos/${todoId}/voice`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => {
        if (!data.audio) throw new Error()
        const audio = new Audio(data.audio)
        audio.onloadedmetadata = () => setDuration(audio.duration)
        audio.ontimeupdate = () => {
          setCurrent(audio.currentTime)
          if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100)
        }
        audio.onended = () => { setPlaying(false); setProgress(0); setCurrent(0) }
        audio.onerror = () => { setError(true); setLoading(false) }
        audioRef.current = audio
        setLoading(false)
      })
      .catch(() => { setError(true); setLoading(false) })

    return () => { audioRef.current?.pause() }
  }, [todoId])

  const togglePlay = () => {
    if (!audioRef.current || loading) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().catch(() => setError(true))
      setPlaying(true)
    }
  }

  const seek = (e) => {
    if (!audioRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audioRef.current.currentTime = pct * duration
    setProgress(pct * 100)
  }

  if (error) return null

  return (
    <div className="voice-note-player">
      {/* Play/Pause */}
      <button
        onClick={togglePlay}
        disabled={loading}
        className="vnp-play-btn"
        aria-label={playing ? 'Pause' : 'Play'}
        type="button"
      >
        {loading
          ? <Loader2 size={14} className="spin" />
          : playing
            ? <Pause size={14} fill="currentColor" />
            : <Play  size={14} fill="currentColor" />
        }
      </button>

      {/* Waveform bars — clickable to seek */}
      <div className="vnp-waveform-wrap" onClick={seek} title="Click to seek">
        {Array(36).fill(0).map((_, i) => (
          <div
            key={i}
            className="vnp-bar"
            style={{
              height: 3 + Math.abs(Math.sin(i * 0.9) * 12 + Math.sin(i * 0.4) * 6),
              background: (i / 36) * 100 <= progress ? 'var(--accent)' : 'var(--border)',
              transition: 'background 0.05s',
            }}
          />
        ))}
      </div>

      {/* Time display */}
      <span className="vnp-time">
        {playing || current > 0 ? formatTime(current) : formatTime(duration)}
      </span>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="vnp-delete-btn"
        aria-label="Delete voice note"
        type="button"
        title="Delete voice note"
      >
        <Trash2 size={11} />
      </button>
    </div>
  )
}
