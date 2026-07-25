// ============================================================
//  LampToggle.jsx  — The lamp switch UI for dark/light theme
//
//  WHAT THIS TEACHES YOU:
//  - Props:  parent passes 'dark' (bool) and 'onToggle' (fn)
//  - State:  local 'flicker' state for the turn-on animation
//  - useRef: to clear the timeout and avoid memory leaks
//  - CSS classes toggled based on prop values
// ============================================================

import { useState, useRef } from 'react'

function LampToggle({ dark, onToggle }) {
  // local state just for the flicker animation on switch-ON
  const [flicker, setFlicker] = useState(false)
  const timerRef = useRef(null)

  const handleClick = () => {
    // If switching TO dark (turning lamp ON) → play flicker
    if (!dark) {
      setFlicker(true)
      // clear any existing timer first to prevent overlap
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setFlicker(false), 600)
    }
    onToggle()
  }

  // CSS class string built from state
  const wrapClass = [
    'lamp-wrap',
    dark ? 'on' : 'off',
    flicker ? 'flicker' : '',
  ].join(' ')

  return (
    <div
      className={wrapClass}
      onClick={handleClick}
      role="button"
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Bruce Wayne Mode (Light)' : 'Batman Mode (Dark)'}
    >
      {/* Wire from ceiling */}
      <div className="lamp-wire" />

      {/* Lamp shade (triangle via CSS borders) */}
      <div className="lamp-shade" />

      {/* Glowing bulb */}
      <div className="lamp-bulb" />

      {/* Cone of light below */}
      <div className="lamp-cone" />

      {/* Text label */}
      <span className="lamp-label">
        {dark ? 'NIGHT MODE' : 'DAY MODE'}
      </span>
    </div>
  )
}

export default LampToggle
