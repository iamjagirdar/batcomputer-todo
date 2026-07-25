# ⚡ Quick Deploy Guide (5 Steps)

## ✅ What I've Prepared For You

All deployment files are ready:
- ✅ `backend/render.yaml` — Render config
- ✅ `frontend/vercel.json` — Vercel config
- ✅ `frontend/src/api.js` — Updated to use env variables
- ✅ `.gitignore` — Ignore node_modules, env files, etc.
- ✅ `DEPLOY.md` — Full detailed guide

---

## 🚀 Deploy in 5 Steps

### **Step 1: Install Git** (if not installed)
Download: https://git-scm.com/downloads  
Then restart your terminal.

### **Step 2: Push to GitHub**
```powershell
cd c:\Users\ikram\Learnings\python_basic_with_ai

git init
git add .
git commit -m "Initial commit"
```

Go to https://github.com/new and create a repo named `batcomputer-todo` (Public)

Then:
```powershell
git remote add origin https://github.com/YOUR-USERNAME/batcomputer-todo.git
git branch -M main
git push -u origin main
```

### **Step 3: Deploy Backend to Render**
1. Sign up: https://render.com/register
2. Click **New +** → **Web Service**
3. Connect your `batcomputer-todo` repo
4. Settings:
   - **Name:** `batcomputer-api`
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free
5. Click **Create Web Service**
6. Wait 2-3 mins → Copy your URL: `https://batcomputer-api-xxxx.onrender.com`

### **Step 4: Update Backend CORS**
Open `backend/main.py` and add your Vercel URL (you'll get it in Step 5):
```python
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://your-vercel-url.vercel.app",  # Add this after Step 5
]
```
Then:
```powershell
git add backend/main.py
git commit -m "Add production CORS"
git push
```

### **Step 5: Deploy Frontend to Vercel**
1. Sign up: https://vercel.com/signup
2. Click **Add New...** → **Project**
3. Import `batcomputer-todo`
4. Settings:
   - **Root Directory:** `frontend`
   - **Framework:** Vite
   - **Environment Variable:**
     - Key: `VITE_API_URL`
     - Value: `https://batcomputer-api-xxxx.onrender.com` (your Render URL)
5. Click **Deploy**
6. Wait 1-2 mins → Your app is live! 🎉

---

## ✅ You're Done!

Open your Vercel URL and test:
- Add todos
- Toggle lamp (dark/light mode)
- Check that todos save (backend working)

**Share your live app with friends!** 🦇

---

## 🔄 Future Updates

Change code → commit → push → auto-deploys!
```powershell
git add .
git commit -m "Updated feature X"
git push
```
Render and Vercel auto-deploy from GitHub.

---

## 📖 Need More Details?

Read `DEPLOY.md` for full troubleshooting and advanced topics.
