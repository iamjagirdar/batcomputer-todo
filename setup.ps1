# ============================================================
#  setup.ps1 — One-Time Project Setup Script (Windows PowerShell)
# ============================================================
#
# WHAT THIS SCRIPT DOES:
#   1. Checks that Python and Node.js are installed
#   2. Installs Python packages (FastAPI, uvicorn, pydantic)
#   3. Installs JavaScript packages (React, Vite, Tailwind, etc.)
#
# HOW TO RUN IT:
#   Open PowerShell in the python_basic_with_ai folder and run:
#     .\setup.ps1
#
#   If you get a "scripts are disabled" error, run this first:
#     Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
# ============================================================

# Stop the script immediately if any command fails
$ErrorActionPreference = "Stop"

# Helper function to print colored section headers
function Write-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "====================================================" -ForegroundColor Cyan
    Write-Host "  $Message" -ForegroundColor Cyan
    Write-Host "====================================================" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "  [OK] $Message" -ForegroundColor Green
}

function Write-Info {
    param([string]$Message)
    Write-Host "  --> $Message" -ForegroundColor Yellow
}


# ============================================================
# STEP 1: Check Prerequisites
# ============================================================
Write-Header "Checking Prerequisites"

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Success "Python found: $pythonVersion"
} catch {
    Write-Host "  [ERROR] Python not found!" -ForegroundColor Red
    Write-Host "  Download Python from: https://www.python.org/downloads/" -ForegroundColor Red
    Write-Host "  Make sure to check 'Add Python to PATH' during installation." -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Success "Node.js found: $nodeVersion"
} catch {
    Write-Host "  [ERROR] Node.js not found!" -ForegroundColor Red
    Write-Host "  Download Node.js from: https://nodejs.org/" -ForegroundColor Red
    Write-Host "  Install the LTS (Long Term Support) version." -ForegroundColor Red
    exit 1
}

# Check npm (comes bundled with Node.js)
try {
    $npmVersion = npm --version 2>&1
    Write-Success "npm found: v$npmVersion"
} catch {
    Write-Host "  [ERROR] npm not found. Reinstall Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}


# ============================================================
# STEP 2: Install Python Dependencies
# ============================================================
Write-Header "Installing Python Backend Dependencies"

$backendPath = Join-Path $PSScriptRoot "backend"

if (-not (Test-Path $backendPath)) {
    Write-Host "  [ERROR] backend/ folder not found." -ForegroundColor Red
    exit 1
}

Write-Info "Running: pip install -r requirements.txt"
Set-Location $backendPath
pip install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Success "Python packages installed successfully!"
} else {
    Write-Host "  [ERROR] pip install failed." -ForegroundColor Red
    exit 1
}


# ============================================================
# STEP 3: Install JavaScript Dependencies
# ============================================================
Write-Header "Installing Frontend JavaScript Dependencies"

$frontendPath = Join-Path $PSScriptRoot "frontend"

if (-not (Test-Path $frontendPath)) {
    Write-Host "  [ERROR] frontend/ folder not found." -ForegroundColor Red
    exit 1
}

Write-Info "Running: npm install"
Set-Location $frontendPath
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Success "JavaScript packages installed successfully!"
} else {
    Write-Host "  [ERROR] npm install failed." -ForegroundColor Red
    exit 1
}


# ============================================================
# DONE — Print Next Steps
# ============================================================
Write-Header "Setup Complete!"

Write-Host ""
Write-Host "  Everything is installed. To run the app:" -ForegroundColor White
Write-Host ""
Write-Host "  TERMINAL 1 — Start the Python backend:" -ForegroundColor Cyan
Write-Host "    cd backend" -ForegroundColor White
Write-Host "    python main.py" -ForegroundColor Yellow
Write-Host "    --> Runs at http://localhost:8000" -ForegroundColor Gray
Write-Host "    --> API explorer at http://localhost:8000/docs" -ForegroundColor Gray
Write-Host ""
Write-Host "  TERMINAL 2 — Start the React frontend:" -ForegroundColor Cyan
Write-Host "    cd frontend" -ForegroundColor White
Write-Host "    npm run dev" -ForegroundColor Yellow
Write-Host "    --> Runs at http://localhost:5173" -ForegroundColor Gray
Write-Host ""
Write-Host "  Open http://localhost:5173 in your browser to use the app." -ForegroundColor Green
Write-Host ""

# Return to the project root
Set-Location $PSScriptRoot
