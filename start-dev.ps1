# ============================================================
#  start-dev.ps1  —  Launch Both Backend + Frontend Servers
# ============================================================
#
#  HOW TO RUN:
#    Right-click this file → "Run with PowerShell"
#    OR in PowerShell:  .\start-dev.ps1
#
#  WHAT IT DOES:
#    1. Starts Python backend in a new window (port 8000)
#    2. Starts React frontend in a new window (port 5173)
#    3. Both run concurrently — close windows to stop servers
# ============================================================

Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🦇 BATCOMPUTER - Starting Development Servers..." -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Get the directory where this script lives
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# ── Start Python backend in a new PowerShell window ──
Write-Host "🐍 Starting Python Backend..." -ForegroundColor Green
$backendPath = Join-Path $projectRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Python Backend Starting...' -ForegroundColor Yellow; python main.py"

# Give backend a moment to start
Start-Sleep -Seconds 2

# ── Start React frontend in a new PowerShell window ──
Write-Host "⚛️  Starting React Frontend..." -ForegroundColor Green
$frontendPath = Join-Path $projectRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'React Frontend Starting...' -ForegroundColor Cyan; npm run dev"

Write-Host ""
Write-Host "✅ Both servers are launching in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs:" -ForegroundColor White
Write-Host "   Backend API:  http://localhost:8000" -ForegroundColor Gray
Write-Host "   API Docs:     http://localhost:8000/docs" -ForegroundColor Gray
Write-Host "   Frontend App: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "🛑 To stop: Close each PowerShell window" -ForegroundColor Red
Write-Host ""

# Keep this window open for 5 seconds so user sees the messages
Start-Sleep -Seconds 5
