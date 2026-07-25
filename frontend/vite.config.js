// ============================================================
//  vite.config.js — Vite Configuration File
// ============================================================
//
// WHAT IS VITE?
//   Vite is a build tool and development server for frontend apps.
//   It makes your React app run super fast during development.
//   When you run "npm run dev", Vite starts a local server at
//   http://localhost:5173 and serves your React app.
//
// WHY DO WE NEED THIS FILE?
//   We need to tell Vite we're using React (via the React plugin).
//   Without this, Vite wouldn't know how to handle .jsx files
//   (files that mix JavaScript and HTML-like syntax).
// ============================================================

import { defineConfig } from 'vite'   // Vite's config helper
import react from '@vitejs/plugin-react'  // Plugin that adds React support

// defineConfig() gives us autocomplete and type checking in editors
export default defineConfig({
  plugins: [
    react()  // Enables React JSX transformation and fast refresh
             // Fast Refresh = your browser updates instantly when you save a file
  ],
})
