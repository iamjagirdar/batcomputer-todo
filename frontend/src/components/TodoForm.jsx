import { useState, useRef } from 'react'
import { Zap, AlignLeft, Plus, Mic, Loader2 } from 'lucide-react'
import VoiceRecorder from './VoiceRecorder'

export default function TodoForm({ onAdd, onVoiceNote }) {
  const [title, setTitle]         = useState('')
  const [description, setDesc]    = useState('')
  const [listening, setListening] = useState(false)
  const [voiceError, setVoiceError] = useState(null)
  const recognitionRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim(), description.trim() || null)
    setTitle('')
    setDesc('')
  }

  // Voice-to-text (fills input)
  const startVoiceToText = () => {
    setVoiceError(null)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { setVoiceError('Not supported in this browser. Try Chrome.'); return }

    if (listening) { recognitionRef.current?.stop(); setListening(false); return }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognitionRef.current = recognition

    recognition.onstart  = () => setListening(true)
    recognition.onresult = (e) => {
      const t = e.results[0][0].transcript
      if (!title.trim()) setTitle(t)
      else setDesc(t)
      setListening(false)
    }
    recognition.onerror = (e) => {
      if (e.error !== 'no-speech') setVoiceError(`Mic error: ${e.error}`)
      setListening(false)
    }
    recognition.onend = () => setListening(false)
    recognition.start()
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="card p-5">

        {/* Title + voice-to-text mic */}
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
          <button
            type="button"
            onClick={startVoiceToText}
            className={`mic-btn ${listening ? 'mic-active' : ''}`}
            title={listening ? 'Stop' : 'Speak to fill title'}
            aria-label="Voice to text"
          >
            {listening ? <Loader2 size={15} className="spin" /> : <Mic size={15} />}
          </button>
        </div>

        {voiceError && <p style={{ fontSize: 11, color: 'var(--danger)', marginBottom: 10, paddingLeft: 30 }}>{voiceError}</p>}

        {listening && (
          <div className="voice-listening">
            <span className="voice-dot" />
            <span className="voice-dot" style={{ animationDelay: '0.2s' }} />
            <span className="voice-dot" style={{ animationDelay: '0.4s' }} />
            <span style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: 2 }}>LISTENING...</span>
          </div>
        )}

        {/* Description */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingLeft: 2 }}>
          <AlignLeft size={14} style={{ color: 'var(--text-lo)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Details (optional)..."
            value={description}
            onChange={e => setDesc(e.target.value)}
            className="input-sub"
          />
        </div>

        {/* Voice note recorder */}
        <div style={{ marginBottom: 16 }}>
          <VoiceRecorder onSend={(blob) => onVoiceNote && onVoiceNote(blob, title, description)} />
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
