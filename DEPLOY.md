# 🚀 Deployment Guide - Batcomputer Todo App

Deploy your Batman Todo app to production in ~15 minutes using **Render (backend)** and **Vercel (frontend)**.

---

## 📋 Prerequisites

1. **GitHub Account** — [Sign up free](https://github.com/signup)
2. **Render Account** — [Sign up free](https://render.com/register)
3. **Vercel Account** — [Sign up free](https://vercel.com/signup)
4. **Git Installed** — [Download Git](https://git-scm.com/downloads)

---

## 🔧 Step 1: Install Git (If Not Installed)

### Windows:
Download and install from: https://git-scm.com/download/win

During installation, accept all defaults.

After install, **restart your terminal** and verify:
```powershell
git --version
```

---

## 📦 Step 2: Push Code to GitHub

### 2.1 Initialize Git
```powershell
cd c:\Users\ikram\Learnings\python_basic_with_ai
git init
git add .
git commit -m "Initial commit - Batman Todo App"
```

### 2.2 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `batcomputer-todo`
3. Make it **Public** (required for free Render/Vercel)
4. Do NOT initialize with README (we already have code)
5. Click **"Create repository"**

### 2.3 Push to GitHub
Copy the commands GitHub shows you (they'll look like this):
```powershell
git remote add origin https://github.com/YOUR-USERNAME/batcomputer-todo.git
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub!

---

## 🐍 Step 3: Deploy Backend to Render

### 3.1 Create Render Account
1. Go to https://render.com/register
2. Sign up with GitHub (easier)

### 3.2 Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `batcomputer-todo`
3. Fill in the form:

   | Field | Value |
   |-------|-------|
   | **Name** | `batcomputer-api` (or any name) |
   | **Region** | Oregon (US West) or closest to you |
   | **Root Directory** | `backend` |
   | **Environment** | `Python 3` |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
   | **Instance Type** | `Free` |

4. Click **"Create Web Service"**

### 3.3 Wait for Deployment
- First deploy takes ~2-3 minutes
- Watch the logs — wait until you see:
  ```
  INFO:     Uvicorn running on http://0.0.0.0:10000
  INFO:     Application startup complete.
  ```
- ✅ Copy your backend URL: `https://batcomputer-api.onrender.com`

### 3.4 Test Your Backend
Open in browser:
```
https://YOUR-BACKEND-NAME.onrender.com/docs
```
You should see the FastAPI interactive docs!

---

## ⚛️ Step 4: Deploy Frontend to Vercel

### 4.1 Create Vercel Account
1. Go to https://vercel.com/signup
2. Sign up with GitHub

### 4.2 Deploy Frontend
1. Click **"Add New..."** → **"Project"**
2. Import `batcomputer-todo` repository
3. Configure:

   | Field | Value |
   |-------|-------|
   | **Framework Preset** | Vite |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

4. **Environment Variables** — Click "Add":
   ```
   Key:   VITE_API_URL
   Value: https://YOUR-BACKEND-NAME.onrender.com
   ```
   ⚠️ Replace with YOUR actual Render backend URL!

5. Click **"Deploy"**

### 4.3 Wait for Deployment
- Takes ~1-2 minutes
- ✅ Your app is live at: `https://batcomputer-todo-xyz.vercel.app`

---

## 🎉 Step 5: Test Your Live App

1. Open your Vercel URL: `https://batcomputer-todo-xyz.vercel.app`
2. Try adding a todo
3. Toggle dark/light mode with the lamp
4. Check that todos persist (backend working)

---

## 🔄 Step 6: Future Updates

### Update Backend
```powershell
cd c:\Users\ikram\Learnings\python_basic_with_ai
# Make your changes to backend/main.py
git add backend/
git commit -m "Update backend"
git push
```
→ Render auto-deploys in ~2 minutes

### Update Frontend
```powershell
# Make your changes to frontend/src/
git add frontend/
git commit -m "Update frontend"
git push
```
→ Vercel auto-deploys in ~1 minute

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** Backend shows "Application failed to respond"
- Check Render logs: Dashboard → your service → Logs
- Make sure `requirements.txt` lists all dependencies
- Verify start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Problem:** CORS errors in frontend
- Check `main.py` line with `allow_origins=[...]`
- Add your Vercel URL:
  ```python
  allow_origins=[
      "http://localhost:5173",
      "https://batcomputer-todo-xyz.vercel.app"  # Add this
  ],
  ```

### Frontend Issues

**Problem:** Frontend can't connect to backend
- Check Environment Variables in Vercel dashboard
- Make sure `VITE_API_URL` matches your Render backend URL exactly
- Redeploy after changing env vars

**Problem:** Images not loading
- Images in `frontend/public/images/` should auto-deploy
- Check browser DevTools Network tab for 404s

---

## 💰 Cost Breakdown

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **GitHub** | Free forever | Unlimited public repos |
| **Render** | 750 hours/month | Backend sleeps after 15min inactivity<br>(wakes up in ~30s on first request) |
| **Vercel** | 100 GB bandwidth/month | More than enough for personal projects |

**Total Cost:** $0/month 🎉

---

## 🎯 Next Steps (Optional)

### Custom Domain
1. Buy a domain (Namecheap, Google Domains, etc.)
2. In Vercel: Settings → Domains → Add your domain
3. In Render: Settings → Custom Domain → Add your domain

### Add a Database
Currently, todos reset when backend restarts (in-memory storage).

To persist data:
1. Use Render's free PostgreSQL database
2. Update `main.py` to use SQLAlchemy + PostgreSQL
3. Tutorials: https://render.com/docs/databases

### Analytics
Add Vercel Analytics (free):
```powershell
cd frontend
npm install @vercel/analytics
```
Follow: https://vercel.com/docs/analytics

---

## 📞 Need Help?

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **FastAPI Deployment:** https://fastapi.tiangolo.com/deployment/

---

**Your app is live! Share the Vercel URL with friends! 🦇**
