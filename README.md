# 🦇 BATCOMPUTER - Todo List App

A full-stack Todo application with **Python FastAPI** backend and **React + Vite + Tailwind CSS** frontend, featuring a Batman dark theme with lamp-switch toggle.

Every file is heavily commented for learning Python and React fundamentals.

---

## 🚀 Quick Start

### Option 1: Automated Start (Recommended)
Double-click or run:
```powershell
.\start-dev.ps1
```
This opens **two separate windows** — one for backend, one for frontend.

### Option 2: Single Terminal
```powershell
.\start-dev-single.ps1
```
Runs both servers in the same window. Press `Ctrl+C` to stop both.

### Option 3: Manual (Two Terminals)

**Terminal 1 — Backend:**
```powershell
cd backend
pip install -r requirements.txt
python main.py
```
→ Backend runs at **http://localhost:8000**  
→ API docs at **http://localhost:8000/docs**

**Terminal 2 — Frontend:**
```powershell
cd frontend
npm install
npm run dev
```
→ Frontend runs at **http://localhost:5173**

---

## 🗂️ Project Structure

```
python_basic_with_ai/
│
├── backend/                   ← Python FastAPI
│   ├── main.py               ← API routes (GET/POST/PUT/DELETE /todos)
│   └── requirements.txt      ← Python dependencies
│
├── frontend/                  ← React + Vite + Tailwind
│   ├── public/
│   │   └── images/           ← Batman theme images
│   │       ├── batman-avatar.jpg
│   │       ├── batman-bg.jpg
│   │       └── gotham-bg.jpg
│   ├── src/
│   │   ├── components/
│   │   │   ├── LampToggle.jsx    ← Theme switcher (dark/light)
│   │   │   ├── TodoForm.jsx      ← Add new todo
│   │   │   └── TodoItem.jsx      ← Single todo row
│   │   ├── App.jsx               ← Main component
│   │   ├── api.js                ← Backend communication
│   │   ├── main.jsx              ← React entry point
│   │   └── index.css             ← Tailwind + custom CSS
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── start-dev.ps1              ← Launch both (separate windows)
├── start-dev-single.ps1       ← Launch both (single terminal)
└── README.md                  ← This file
```

---

## 🎨 Features

### 🦇 **Batman Theme**
- **Dark Mode (default):** Pure black background, yellow accents, Batman cityscape
- **Light Mode:** Clean modern white/gray with gold accents
- **Lamp Toggle:** Hanging ceiling lamp animation — click to switch themes
- **Real Batman Images:** Local Batman avatar + Gotham skyline background

### ✅ **Full CRUD Operations**
- ✨ Create new missions (todos)
- 📋 View all missions with filter (all/active/completed)
- ✅ Mark missions complete/incomplete
- 🗑️ Delete missions
- 📊 Progress bar & stats (total, active, completed)

### ⚡ **Tech Stack**
- **Backend:** Python 3.12 + FastAPI + Uvicorn
- **Frontend:** React 18 + Vite 5 + Tailwind CSS 3
- **Icons:** Lucide React (clean SVG icons)
- **Data Storage:** In-memory (resets on restart — perfect for learning)

---

## 📚 What You'll Learn

### Python Concepts (in `backend/main.py`)
- Functions with type hints
- Pydantic models for data validation
- FastAPI decorators (`@app.get`, `@app.post`, etc.)
- CORS middleware
- HTTP methods (GET, POST, PUT, DELETE)
- List comprehensions
- Exception handling with `HTTPException`
- UUID generation
- `if __name__ == "__main__"` pattern

### React Concepts (in `frontend/src/`)
- Functional components
- `useState` and `useEffect` hooks
- Props and lifting state up
- Controlled inputs
- Conditional rendering
- List rendering with `.map()`
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Async/await for API calls
- CSS custom properties (CSS variables)
- Theme switching

### API Communication
- Axios for HTTP requests
- REST API patterns
- Request/response cycle
- Error handling
- Optimistic UI updates

---

## 🔧 Development Tips

### Backend
- Visit **http://localhost:8000/docs** for interactive API testing (FastAPI auto-generates this!)
- Modify `backend/main.py` → server auto-reloads (Uvicorn watch mode)
- Todo data resets when you restart the server (in-memory storage)

### Frontend
- Edit any `.jsx` file → browser auto-refreshes (Vite HMR)
- Tailwind classes update instantly
- Check browser DevTools Console for errors (F12)
- Network tab shows all API requests

### Theme Customization
- Edit CSS variables in `frontend/src/index.css` (`:root` and `html.light`)
- Replace images in `frontend/public/images/` to customize the Batman visuals
- Adjust `--hero-opacity` to make background more/less visible

---

## 🐛 Troubleshooting

**Backend won't start?**
- Check if port 8000 is already in use
- Make sure Python 3.12 is installed: `python --version`
- Reinstall packages: `pip install -r requirements.txt`

**Frontend won't start?**
- Check if port 5173 is already in use
- Make sure Node.js is installed: `node --version`
- Delete `node_modules` and run `npm install` again

**Images not showing?**
- Images are in `frontend/public/images/`
- Vite serves `/images/...` directly from `public/`
- Check browser DevTools Network tab for 404 errors

**Can't connect frontend to backend?**
- Make sure backend is running on port 8000
- Check `frontend/src/api.js` — `BASE_URL` should be `http://localhost:8000`
- Look for CORS errors in browser console

---

## 📖 Learning Path

1. **Start with Python backend** — read `backend/main.py` from top to bottom
2. **Test the API** — visit http://localhost:8000/docs and try creating/fetching todos
3. **Explore React components** — start with `TodoForm.jsx`, then `TodoItem.jsx`, then `App.jsx`
4. **Understand state flow** — trace how clicking "Add" in the form updates the todo list
5. **Experiment** — try adding a "priority" field, or changing colors, or adding sound effects

---

## 🎯 Next Steps (Ideas to Extend This Project)

- [ ] Add a **database** (SQLite or PostgreSQL) instead of in-memory storage
- [ ] Add **user authentication** (login/register)
- [ ] Add **due dates** and sort todos by date
- [ ] Add **categories/tags** for todos
- [ ] Add **search/filter** by keyword
- [ ] Deploy backend to **Heroku/Railway** and frontend to **Vercel/Netlify**
- [ ] Add **drag-and-drop** to reorder todos
- [ ] Add **local storage** to persist todos in browser
- [ ] Add **animations** with Framer Motion
- [ ] Add **sound effects** when completing missions

---

## 📜 License

Free to use for learning. Batman imagery is copyrighted by DC Comics (used here for educational purposes only).

---

## 💬 Quote

> *"I am the night."* — Batman

Happy coding! 🦇
