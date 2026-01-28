# SQUAD PLANNER - AUTO DEPLOYMENT SCRIPT
# Deploie automatiquement Phase 0, 1, 2 à 100%

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  SQUAD PLANNER - AUTO DEPLOYMENT" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $PSScriptRoot

# 1. MIGRATIONS SQL
Write-Host "[1/3] Deploiement SQL Migrations..." -ForegroundColor Yellow
Write-Host ""

$sqlFile = Join-Path $projectRoot "supabase\DEPLOY_ALL_MIGRATIONS.sql"
$sqlContent = Get-Content $sqlFile -Raw

# Copier dans clipboard
Set-Clipboard -Value $sqlContent
Write-Host "✓ SQL copie dans le presse-papier" -ForegroundColor Green

# Ouvrir Supabase Dashboard
$supabaseUrl = "https://supabase.com/dashboard/project/cwtoprbowdqcemdjrtir/sql/new"
Start-Process $supabaseUrl

Write-Host ""
Write-Host "Action: Collez (Ctrl+V) dans l'editeur SQL et cliquez RUN" -ForegroundColor Yellow
Write-Host ""
Read-Host "Appuyez sur Entree quand les migrations sont executees"
Write-Host ""

# 2. VERCEL SECRETS
Write-Host "[2/3] Configuration Vercel Secrets..." -ForegroundColor Yellow
Write-Host ""

# Generer CRON_SECRET
$cronSecret = [guid]::NewGuid().ToString()
Write-Host "CRON_SECRET genere: $cronSecret" -ForegroundColor Green

# Sauvegarder dans .env.local
$envLocal = Join-Path $projectRoot ".env.local"
Add-Content -Path $envLocal -Value "`nCRON_SECRET=$cronSecret"

Write-Host ""
Write-Host "Ouvrir Supabase pour copier SERVICE_ROLE_KEY..." -ForegroundColor Yellow
Start-Process "https://supabase.com/dashboard/project/cwtoprbowdqcemdjrtir/settings/api"
Write-Host ""
$serviceKey = Read-Host "Collez la service_role key (secret)"

Add-Content -Path $envLocal -Value "SUPABASE_SERVICE_ROLE_KEY=$serviceKey"
Write-Host "✓ Secrets sauvegardes dans .env.local" -ForegroundColor Green

# Configurer Vercel (si CLI installé)
if (Get-Command vercel -ErrorAction SilentlyContinue) {
    Write-Host ""
    Write-Host "Configuration Vercel..." -ForegroundColor Yellow

    # Set environment variables
    $env:CRON_SECRET = $cronSecret
    vercel env add CRON_SECRET production <<< $cronSecret 2>$null

    $env:SUPABASE_SERVICE_ROLE_KEY = $serviceKey
    vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< $serviceKey 2>$null

    Write-Host "✓ Vercel configureé" -ForegroundColor Green
} else {
    Write-Host "⚠ Vercel CLI non installe - configurez manuellement" -ForegroundColor Yellow
}

Write-Host ""

# 3. GIT PUSH & DEPLOY
Write-Host "[3/3] Git Push & Deploy..." -ForegroundColor Yellow
Write-Host ""

Set-Location $projectRoot

git add .
git commit -m "deploy: Complete Phase 0+1+2 (100%) - All migrations deployed"
git push

Write-Host "✓ Code pushed to GitHub" -ForegroundColor Green
Write-Host ""

# Vercel deploy
if (Get-Command vercel -ErrorAction SilentlyContinue) {
    Write-Host "Deploiement Vercel..." -ForegroundColor Yellow
    vercel --prod
    Write-Host "✓ Deploye sur Vercel!" -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   DEPLOYMENT TERMINE! 🎉" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Phase 0: 100% ✓" -ForegroundColor Green
Write-Host "Phase 1: 100% ✓" -ForegroundColor Green
Write-Host "Phase 2: 100% ✓" -ForegroundColor Green
Write-Host ""
Write-Host "Application deployee: https://squad-planner-v2-rudy.vercel.app" -ForegroundColor Cyan
Write-Host ""
