# PowerShell Script for GitHub Pages Deployment
# UTF-8 Encoding with BOM
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🚀 IBBA OTT Dashboard - פרסום אוטומטי ל-GitHub Pages" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "📋 בודק דרישות מוקדמות..." -ForegroundColor Yellow
Write-Host ""

# Check Git
try {
    $gitVersion = git --version
    Write-Host "✅ Git מותקן: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git לא מותקן" -ForegroundColor Red
    Write-Host "התקן מ: https://git-scm.com/download/win" -ForegroundColor Yellow
    Read-Host "לחץ Enter לסיום"
    exit 1
}

# Check Node
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js מותקן: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js לא מותקן" -ForegroundColor Red
    Read-Host "לחץ Enter לסיום"
    exit 1
}

# Check data file
if (-not (Test-Path "public\data\ott-data.json")) {
    Write-Host ""
    Write-Host "❌ קובץ הנתונים לא קיים: public\data\ott-data.json" -ForegroundColor Red
    Write-Host ""
    Write-Host "רוץ תחילה: npm run convert your-file.xlsx" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "לחץ Enter לסיום"
    exit 1
}
Write-Host "✅ קובץ נתונים קיים" -ForegroundColor Green
Write-Host ""

# Create .env files
Write-Host "📝 יוצר קבצי .env..." -ForegroundColor Yellow

if (-not (Test-Path ".env.development")) {
    "VITE_PRODUCTION_MODE=false" | Out-File -FilePath ".env.development" -Encoding utf8
    Write-Host "✅ נוצר: .env.development" -ForegroundColor Green
}

if (-not (Test-Path ".env.production")) {
    @"
VITE_PRODUCTION_MODE=true
VITE_DATA_FILE=/data/ott-data.json
"@ | Out-File -FilePath ".env.production" -Encoding utf8
    Write-Host "✅ נוצר: .env.production" -ForegroundColor Green
}

if (-not (Test-Path ".env.example")) {
    @"
# Production mode
VITE_PRODUCTION_MODE=true
VITE_DATA_FILE=/data/ott-data.json
"@ | Out-File -FilePath ".env.example" -Encoding utf8
    Write-Host "✅ נוצר: .env.example" -ForegroundColor Green
}
Write-Host ""

# Build
Write-Host "🔨 בונה לייצור..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ שגיאה בבנייה" -ForegroundColor Red
    Read-Host "לחץ Enter לסיום"
    exit 1
}
Write-Host "✅ בנייה הושלמה" -ForegroundColor Green
Write-Host ""

# Get GitHub details
Write-Host "📊 הגדרות GitHub" -ForegroundColor Yellow
Write-Host ""

$repoName = Read-Host "הכנס שם ל-repository (ברירת מחדל: ott-dashboard)"
if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "ott-dashboard"
}

$ghUser = Read-Host "הכנס את שם המשתמש שלך ב-GitHub"
if ([string]::IsNullOrWhiteSpace($ghUser)) {
    Write-Host "❌ שם משתמש חובה" -ForegroundColor Red
    Read-Host "לחץ Enter לסיום"
    exit 1
}

Write-Host ""
Write-Host "📦 מאתחל Git..." -ForegroundColor Yellow

# Initialize Git
if (-not (Test-Path ".git")) {
    git init
    Write-Host "✅ Git אותחל" -ForegroundColor Green
}

# Update vite.config.js
Write-Host "🔧 מעדכן vite.config.js..." -ForegroundColor Yellow
$viteConfig = Get-Content "vite.config.js" -Raw
$viteConfig = $viteConfig -replace "base: '/'", "base: '/$repoName/'"
$viteConfig | Set-Content "vite.config.js" -Encoding utf8
Write-Host "✅ vite.config.js עודכן" -ForegroundColor Green

# Git operations
git add .
git commit -m "Initial commit: OTT Dashboard v2.2.1 with data" 2>$null
git branch -M main
git remote remove origin 2>$null
git remote add origin "https://github.com/$ghUser/$repoName.git"

Write-Host ""
Write-Host "📤 מעלה ל-GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "⚠️ שגיאה בהעלאה" -ForegroundColor Red
    Write-Host ""
    Write-Host "אולי ה-repository לא קיים?" -ForegroundColor Yellow
    Write-Host "צור repository ב: https://github.com/new" -ForegroundColor Yellow
    Write-Host "שם: $repoName" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "לחץ Enter אחרי שיצרת את ה-repository"
    
    git push -u origin main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ עדיין יש שגיאה" -ForegroundColor Red
        Read-Host "לחץ Enter לסיום"
        exit 1
    }
}

Write-Host "✅ הועלה ל-GitHub" -ForegroundColor Green
Write-Host ""

# Final instructions
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   ⚙️ שלב אחרון: הגדרת GitHub Pages" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "לך לכתובת הזו:" -ForegroundColor Yellow
Write-Host "https://github.com/$ghUser/$repoName/settings/pages" -ForegroundColor Cyan
Write-Host ""
Write-Host "תחת 'Source' בחר: " -ForegroundColor Yellow -NoNewline
Write-Host "GitHub Actions" -ForegroundColor Green
Write-Host ""
Write-Host "לחץ Save" -ForegroundColor Yellow
Write-Host ""
Write-Host "אחר כך בדוק את הבנייה:" -ForegroundColor Yellow
Write-Host "https://github.com/$ghUser/$repoName/actions" -ForegroundColor Cyan
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🌐 הדשבורד שלך יהיה זמין ב:" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "https://$ghUser.github.io/$repoName/" -ForegroundColor Green
Write-Host ""
Write-Host "⏱️ המתן 2-3 דקות לסיום הבנייה" -ForegroundColor Yellow
Write-Host ""
Read-Host "לחץ Enter לסיום"


