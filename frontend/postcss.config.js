// ============================================================
//  postcss.config.js — PostCSS Configuration
// ============================================================
//
// WHAT IS POSTCSS?
//   PostCSS is a tool that transforms CSS using plugins.
//   Think of it as a pipeline your CSS goes through before
//   it reaches the browser.
//
// WHY DO WE NEED THIS?
//   Tailwind CSS is actually a PostCSS plugin!
//   When Vite builds your app, it runs PostCSS which:
//     1. tailwindcss  → generates utility classes from your usage
//     2. autoprefixer → adds browser-specific prefixes automatically
//        e.g. "-webkit-transform" for older Safari browsers
//
//   You don't need to understand the internals — just know this
//   file is required for Tailwind to work with Vite.
// ============================================================

export default {
  plugins: {
    tailwindcss: {},   // Process Tailwind CSS utility classes
    autoprefixer: {},  // Auto-add vendor prefixes for browser compatibility
  },
}
