# ============================================================
#  start-dev-single.ps1  —  Run Both in Single Terminal
# ============================================================
#
#  HOW TO RUN:
#    In PowerShell:  .\start-dev-single.ps1
#
#  WHAT IT DOES:
#    Runs both servers in the SAME terminal window using background jobs
#    Press Ctrl+C to stop both at once
# ============================================================

Write-Host ""
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🦇 BATCOMPUTER - Single Terminal Mode" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend"

# Start backend as a background job
Write-Host "🐍 Starting Python Backend (background job)..." -ForegroundColor Green
$backendJob = Start-Job -ScriptBlock {
    param($path)
    Set-Location $path
    python main.py
} -ArgumentList $backendPath

Start-Sleep -Seconds 2

# Start frontend as a background job
Write-Host "⚛️  Starting React Frontend (background job)..." -ForegroundColor Green
$frontendJob = Start-Job -ScriptBlock {
    param($path)
    Set-Location $path
    npm run dev
} -ArgumentList $frontendPath

Write-Host ""
Write-Host "✅ Both servers are running!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs:" -ForegroundColor White
Write-Host "   Backend:  http://localhost:8000" -ForegroundColor Gray
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 Showing live logs... Press Ctrl+C to stop both servers" -ForegroundColor Cyan
Write-Host ""

# Stream logs from both jobs
try {
    while ($true) {
        # Get output from backend
        $backendOutput = Receive-Job -Job $backendJob -ErrorAction SilentlyContinue
        if ($backendOutput) {
            Write-Host "[BACKEND] " -ForegroundColor Green -NoNewline
            Write-Host $backendOutput
        }

        # Get output from frontend
        $frontendOutput = Receive-Job -Job $frontendJob -ErrorAction SilentlyContinue
        if ($frontendOutput) {
            Write-Host "[FRONTEND] " -ForegroundColor Cyan -NoNewline
            Write-Host $frontendOutput
        }

        Start-Sleep -Milliseconds 500
    }
}
finally {
    Write-Host ""
    Write-Host "🛑 Stopping servers..." -ForegroundColor Red
    Stop-Job -Job $backendJob, $frontendJob
    Remove-Job -Job $backendJob, $frontendJob
    Write-Host "✅ Servers stopped." -ForegroundColor Green
}
