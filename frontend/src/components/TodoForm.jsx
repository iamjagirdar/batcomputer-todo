import { useState, useRef } from 'react'
import { Zap, AlignLeft, Plus, Mic, MicOff, Loader2 } from 'lucide-react'

export default function TodoForm({ onAdd }) {
  const [title, setTitle]       = useState('')
  const [description, setDesc]  = useState('')
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

  const startVoice = () => {
    setVoiceError(null)

    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceError('Voice input not supported in this browser. Try Chrome.')
      return
    }

    if (listening) {
      // Stop listening
      recognitionRef.current?.stop()
      setListening(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognitionRef.current = recognition

    recognition.onstart = () => setListening(true)

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      // If title empty, fill title. Otherwise append to description.
      if (!title.trim()) {
        setTitle(transcript)
      } else {
        setDesc(transcript)
      }
      setListening(false)
    }

    recognition.onerror = (event) => {
      if (event.error !== 'no-speech') {
        setVoiceError(`Voice error: ${event.error}`)
      }
      setListening(false)
    }

    recognition.onend = () => setListening(false)

    recognition.start()
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="card p-5">

        {/* Title row with mic button */}
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
          {/* Voice mic button */}
          <button
            type="button"
            onClick={startVoice}
            className={`mic-btn ${listening ? 'mic-active' : ''}`}
            title={listening ? 'Stop listening' : 'Speak your mission'}
            aria-label="Voice input"
          >
            {listening
              ? <Loader2 size={15} className="spin" />
              : <Mic size={15} />
            }
          </button>
        </div>

        {/* Voice error */}
        {voiceError && (
          <p style={{ fontSize: 11, color: 'var(--danger)', marginBottom: 12, paddingLeft: 30 }}>
            {voiceError}
          </p>
        )}

        {/* Listening indicator */}
        {listening && (
          <div className="voice-listening">
            <span className="voice-dot" />
            <span className="voice-dot" style={{ animationDelay: '0.2s' }} />
            <span className="voice-dot" style={{ animationDelay: '0.4s' }} />
            <span style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: 2 }}>LISTENING...</span>
          </div>
        )}

        {/* Description */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingLeft: 2 }}>
          <AlignLeft size={14} style={{ color: 'var(--text-lo)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Details (optional) — or speak after title..."
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
