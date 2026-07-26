// ============================================================
//  api.js — API Communication Layer
// ============================================================
//
//  All backend calls go through here.
//  Auth endpoints (login/register) are open.
//  Todo endpoints require a JWT token in the Authorization header.
// ============================================================

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ── Axios instance ────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor — attach JWT token automatically ──────
// Before every request, check localStorage for a token and add it.
// This means we never have to manually add "Authorization" headers.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bat_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor — handle 401 globally ───────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage
      localStorage.removeItem('bat_token')
      localStorage.removeItem('bat_user')
    }
    return Promise.reject(error)
  }
)


// ============================================================
// AUTH API
// ============================================================

/**
 * Register a new user
 * POST /auth/register
 * Returns: { access_token, token_type, user: { id, username, email } }
 */
export const registerUser = async (username, email, password) => {
  const { data } = await api.post('/auth/register', { username, email, password })
  return data
}

/**
 * Login with email + password
 * POST /auth/login
 * Returns: { access_token, token_type, user: { id, username, email } }
 */
export const loginUser = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

/**
 * Get current logged-in user from token
 * GET /auth/me
 */
export const getMe = async () => {
  const { data } = await api.get('/auth/me')
  return data
}


// ============================================================
// TODO API  (all require JWT — added automatically by interceptor)
// ============================================================

/**
 * Fetch all todos for the current user
 * GET /todos
 */
export const getTodos = async () => {
  const { data } = await api.get('/todos')
  return data
}

/**
 * Create a new todo
 * POST /todos
 */
export const createTodo = async (title, description = null) => {
  const { data } = await api.post('/todos', { title, description })
  return data
}

/**
 * Update a todo
 * PUT /todos/:id
 */
export const updateTodo = async (id, updates) => {
  const { data } = await api.put(`/todos/${id}`, updates)
  return data
}

/**
 * Delete a todo
 * DELETE /todos/:id
 */
export const deleteTodo = async (id) => {
  await api.delete(`/todos/${id}`)
}
