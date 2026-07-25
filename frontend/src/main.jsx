// ============================================================
//  main.jsx — The Entry Point of the React App
// ============================================================
//
// WHAT IS JSX?
//   JSX is a special JavaScript syntax that looks like HTML.
//   Example:  <h1>Hello</h1>  written inside JavaScript.
//   The browser can't understand JSX directly — Vite transforms
//   it into regular JavaScript before sending it to the browser.
//
// THIS FILE'S JOB:
//   Connect React to the HTML page (index.html).
//   It finds the <div id="root"> and tells React to take over that div.
// ============================================================

import React from 'react'           // The core React library
import ReactDOM from 'react-dom/client'  // Lets React render into the browser DOM
import App from './App'              // Our main App component (./App means ./App.jsx)
import './index.css'                 // Import Tailwind CSS (must be imported here!)

// ReactDOM.createRoot() — creates a React "root" inside the div#root element
// document.getElementById('root') — finds the <div id="root"> from index.html
const root = ReactDOM.createRoot(document.getElementById('root'))

// root.render() — renders our React component tree into the root div
// <React.StrictMode> is a development tool that:
//   - Warns you about common mistakes
//   - Highlights components with unsafe patterns
//   - ONLY runs in development, doesn't affect production
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
