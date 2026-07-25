// ============================================================
//  api.js — API Communication Layer
// ============================================================
//
// WHY HAVE A SEPARATE FILE FOR THIS?
//   Separation of concerns — a core programming principle.
//   This file handles ALL communication with the Python backend.
//   Our components (App.jsx, TodoItem.jsx) just call these functions
//   without worrying about URLs, HTTP methods, or error handling.
//
// WHAT IS AXIOS?
//   Axios is a JavaScript library that makes HTTP requests easy.
//   It's like fetch() but with cleaner syntax and better error handling.
//   
//   fetch example (built-in, verbose):
//     const res = await fetch('/todos')
//     const data = await res.json()
//
//   axios example (cleaner):
//     const { data } = await axios.get('/todos')
// ============================================================

import axios from 'axios'

// BASE URL — where our Python FastAPI backend is running
// In production, this will be your Render backend URL
// In development, it's localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create an axios "instance" with default settings
// All requests made with this instance automatically use BASE_URL
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',  // Tell the server we're sending JSON
  },
})


// ============================================================
// API FUNCTIONS
// Each function corresponds to one backend endpoint.
// They all return Promises — async operations that resolve later.
// ============================================================

/**
 * Fetch all todos from the backend
 * GET http://localhost:8000/todos
 * Returns: array of todo objects
 */
export const getTodos = async () => {
  // api.get() sends a GET request
  // We destructure { data } from the response — that's the actual todos array
  const { data } = await api.get('/todos')
  return data
}

/**
 * Create a new todo
 * POST http://localhost:8000/todos
 * @param {string} title - The todo title (required)
 * @param {string} description - Extra details (optional)
 * Returns: the newly created todo object
 */
export const createTodo = async (title, description = null) => {
  // api.post() sends a POST request with a JSON body
  // The second argument is the request body (what we send to Python)
  const { data } = await api.post('/todos', { title, description })
  return data
}

/**
 * Toggle a todo's completed status (or update any field)
 * PUT http://localhost:8000/todos/:id
 * @param {string} id - The todo's unique ID
 * @param {object} updates - Fields to update e.g. { completed: true }
 * Returns: the updated todo object
 */
export const updateTodo = async (id, updates) => {
  // api.put() sends a PUT request
  // The URL includes the ID: /todos/abc123
  // Template literals (backticks) let us embed variables in strings
  const { data } = await api.put(`/todos/${id}`, updates)
  return data
}

/**
 * Delete a todo permanently
 * DELETE http://localhost:8000/todos/:id
 * @param {string} id - The todo's unique ID
 * Returns: nothing (204 No Content)
 */
export const deleteTodo = async (id) => {
  await api.delete(`/todos/${id}`)
  // No return value needed — we just need to know it succeeded
}
