import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Send, Trash2, Play, Pause } from 'lucide-react'

// Format seconds → "0:05", "1:23"
function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function VoiceRecorder({ onSend }) {
  const [state, setState]       = useState('idle')    // idle | recording | preview
  const [duration, setDuration] = useState(0)
  const [playback, setPlayback] = useState(false)
  const [progress, setProgress] = useState(0)
  const [bars, setBars]         = useState(Array(40).fill(3))

  const mediaRecorderRef = useRef(null)
  const chunksRef        = useRef([])
  const audioBlobRef     = useRef(null)
  const audioRef         = useRef(null)
  const timerRef         = useRef(null)
  const analyserRef      = useRef(null)
  const animFrameRef     = useRef(null)
  const streamRef        = useRef(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
      cancelAnimationFrame(animFrameRef.current)
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  // ── Start recording ──────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Setup audio analyser for waveform visualization
      const audioCtx  = new (window.AudioContext || window.webkitAudioContext)()
      const source    = audioCtx.createMediaStreamSource(stream)
      const analyser  = audioCtx.createAnalyser()
      analyser.fftSize = 128
      source.connect(analyser)
      analyserRef.current = analyser

      // Start MediaRecorder
      const recorder = new MediaRecorder(stream, { mimeType: getSupportedMimeType() })
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = () => {
        const mimeType = getSupportedMimeType()
        const blob = new Blob(chunksRef.current, { type: mimeType })
        audioBlobRef.current = blob
        audioRef.current = new Audio(URL.createObjectURL(blob))
        audioRef.current.ontimeupdate = () => {
          const p = (audioRef.current.currentTime / audioRef.current.duration) * 100
          setProgress(isNaN(p) ? 0 : p)
        }
        audioRef.current.onended = () => { setPlayback(false); setProgress(0) }
        setState('preview')
      }

      recorder.start(100)
      setState('recording')
      setDuration(0)

      // Duration timer
      timerRef.current = setInterval(() => {
        setDuration(d => {
          if (d >= 120) { stopRecording(); return d } // max 2 min
          return d + 1
        })
      }, 1000)

      // Waveform animation
      drawWaveform()

    } catch {
      alert('Microphone access denied. Please allow microphone to record voice notes.')
    }
  }

  const getSupportedMimeType = () => {
    const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4']
    return types.find(t => MediaRecorder.isTypeSupported(t)) || 'audio/webm'
  }

  const drawWaveform = () => {
    const analyser = analyserRef.current
    if (!analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    const draw = () => {
      analyser.getByteFrequencyData(data)
      const newBars = Array(40).fill(0).map((_, i) => {
        const idx = Math.floor(i * data.length / 40)
        return Math.max(3, (data[idx] / 255) * 48)
      })
      setBars(newBars)
      animFrameRef.current = requestAnimationFrame(draw)
    }
    draw()
  }

  // ── Stop recording ───────────────────────────────────────────
  const stopRecording = () => {
    clearInterval(timerRef.current)
    cancelAnimationFrame(animFrameRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    mediaRecorderRef.current?.stop()
    setBars(Array(40).fill(3))
  }

  // ── Discard ──────────────────────────────────────────────────
  const discard = () => {
    audioRef.current?.pause()
    audioBlobRef.current = null
    setState('idle')
    setDuration(0)
    setProgress(0)
    setPlayback(false)
    setBars(Array(40).fill(3))
  }

  // ── Toggle playback ──────────────────────────────────────────
  const togglePlay = () => {
    if (!audioRef.current) return
    if (playback) {
      audioRef.current.pause()
      setPlayback(false)
    } else {
      audioRef.current.play()
      setPlayback(true)
    }
  }

  // ── Send ─────────────────────────────────────────────────────
  const handleSend = () => {
    if (!audioBlobRef.current) return
    onSend(audioBlobRef.current)
    discard()
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="voice-recorder">

      {/* ── IDLE: just mic button ── */}
      {state === 'idle' && (
        <button
          type="button"
          onClick={startRecording}
          className="voice-mic-btn"
          title="Record voice note"
          aria-label="Record voice note"
        >
          <Mic size={16} />
          <span>Voice Note</span>
        </button>
      )}

      {/* ── RECORDING ── */}
      {state === 'recording' && (
        <div className="voice-recording-bar">
          {/* Pulsing red dot */}
          <div className="voice-rec-dot" />

          {/* Live waveform */}
          <div className="voice-waveform">
            {bars.map((h, i) => (
              <div key={i} className="voice-bar" style={{ height: h }} />
            ))}
          </div>

          {/* Duration */}
          <span className="voice-duration">{formatTime(duration)}</span>

          {/* Stop button */}
          <button type="button" onClick={stopRecording} className="voice-stop-btn" aria-label="Stop recording">
            <Square size={14} fill="currentColor" />
          </button>
        </div>
      )}

      {/* ── PREVIEW: playback + send/discard ── */}
      {state === 'preview' && (
        <div className="voice-preview-bar">
          {/* Discard */}
          <button type="button" onClick={discard} className="voice-discard-btn" aria-label="Discard">
            <Trash2 size={14} />
          </button>

          {/* Play/Pause */}
          <button type="button" onClick={togglePlay} className="voice-play-btn" aria-label="Play/Pause">
            {playback ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          </button>

          {/* Progress bar + static waveform */}
          <div className="voice-progress-wrap">
            <div className="voice-static-waveform">
              {Array(40).fill(0).map((_, i) => (
                <div
                  key={i}
                  className="voice-bar"
                  style={{
                    height: 4 + Math.sin(i * 0.8) * 10 + Math.sin(i * 0.3) * 8,
                    opacity: (i / 40) * 100 <= progress ? 1 : 0.3,
                  }}
                />
              ))}
            </div>
            <div className="voice-progress-line" style={{ width: `${progress}%` }} />
          </div>

          {/* Duration */}
          <span className="voice-duration">{formatTime(duration)}</span>

          {/* Send button */}
          <button type="button" onClick={handleSend} className="voice-send-btn" aria-label="Send voice note">
            <Send size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
