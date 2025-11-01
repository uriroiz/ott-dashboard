@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

echo ════════════════════════════════════════════════════════════
echo    🚀 IBBA OTT Dashboard - פרסום אוטומטי ל-GitHub Pages
echo ════════════════════════════════════════════════════════════
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ שגיאה: הסקריפט צריך לרוץ מתיקיית ott-dashboard
    echo.
    pause
    exit /b 1
)

echo 📋 שלב 1/7: בדיקת דרישות מוקדמות
echo ────────────────────────────────────────────────────────────

REM Check Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git לא מותקן
    echo.
    echo התקן Git מ: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo ✅ Git מותקן

REM Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js לא מותקן
    pause
    exit /b 1
)
echo ✅ Node.js מותקן

REM Check if node_modules exists
if not exist "node_modules" (
    echo ⚠️ node_modules לא קיים, מתקין תלויות...
    call npm install
    if errorlevel 1 (
        echo ❌ שגיאה בהתקנת תלויות
        pause
        exit /b 1
    )
)
echo ✅ תלויות מותקנות

REM Check if JSON data exists
if not exist "public\data\ott-data.json" (
    echo.
    echo ❌ קובץ הנתונים לא קיים: public\data\ott-data.json
    echo.
    echo רוץ תחילה:
    echo    npm run convert your-file.xlsx
    echo.
    pause
    exit /b 1
)
echo ✅ קובץ נתונים קיים
echo.

echo 📝 שלב 2/7: יצירת קבצי .env
echo ────────────────────────────────────────────────────────────

REM Create .env.development
if not exist ".env.development" (
    echo VITE_PRODUCTION_MODE=false > .env.development
    echo ✅ נוצר: .env.development
) else (
    echo ℹ️ קיים: .env.development
)

REM Create .env.production
if not exist ".env.production" (
    (
        echo VITE_PRODUCTION_MODE=true
        echo VITE_DATA_FILE=/data/ott-data.json
    ) > .env.production
    echo ✅ נוצר: .env.production
) else (
    echo ℹ️ קיים: .env.production
)

REM Create .env.example
if not exist ".env.example" (
    (
        echo # Production mode - load data from JSON file instead of Excel upload
        echo VITE_PRODUCTION_MODE=true
        echo.
        echo # Path to JSON data file
        echo VITE_DATA_FILE=/data/ott-data.json
    ) > .env.example
    echo ✅ נוצר: .env.example
) else (
    echo ℹ️ קיים: .env.example
)
echo.

echo 🔨 שלב 3/7: בנייה לייצור
echo ────────────────────────────────────────────────────────────
call npm run build
if errorlevel 1 (
    echo ❌ שגיאה בבנייה
    pause
    exit /b 1
)
echo ✅ בנייה הושלמה
echo.

echo 📊 שלב 4/7: הגדרות GitHub
echo ────────────────────────────────────────────────────────────

REM Check if gh CLI is installed
gh --version >nul 2>&1
if errorlevel 1 (
    set USE_GH=0
    echo ℹ️ GitHub CLI לא מותקן - מצב ידני
) else (
    set USE_GH=1
    echo ✅ GitHub CLI מותקן
)
echo.

if !USE_GH!==1 (
    echo 🎯 משתמש ב-GitHub CLI לפרסום אוטומטי
    echo.
    
    REM Get repo name
    set /p REPO_NAME="הכנס שם ל-repository (לדוגמה: ott-dashboard): "
    if "!REPO_NAME!"=="" set REPO_NAME=ott-dashboard
    
    echo.
    echo 📦 שלב 5/7: יוצר repository ב-GitHub...
    echo ────────────────────────────────────────────────────────────
    
    REM Check if already initialized
    if exist ".git" (
        echo ℹ️ Git כבר מאותחל
    ) else (
        git init
        echo ✅ Git אותחל
    )
    
    REM Create GitHub repo
    gh repo create !REPO_NAME! --public --source=. --remote=origin --push
    if errorlevel 1 (
        echo.
        echo ⚠️ Repository אולי כבר קיים או יש בעיית הרשאות
        echo ממשיך בכל מקרה...
    )
    
    echo.
    echo 📤 שלב 6/7: מעלה קבצים...
    echo ────────────────────────────────────────────────────────────
    
    git add .
    git commit -m "Initial commit: OTT Dashboard v2.2.1 with data" 2>nul
    if errorlevel 1 (
        echo ℹ️ אין שינויים חדשים או כבר יש commit
    ) else (
        echo ✅ Commit נוצר
    )
    
    git branch -M main 2>nul
    git push -u origin main
    if errorlevel 1 (
        echo ⚠️ יתכן שכבר הועלה
    ) else (
        echo ✅ הועלה ל-GitHub
    )
    
    echo.
    echo ⚙️ שלב 7/7: מגדיר GitHub Pages...
    echo ────────────────────────────────────────────────────────────
    
    REM Enable GitHub Pages with GitHub Actions
    gh api -X PUT "repos/{owner}/!REPO_NAME!/pages" -f source[branch]=main -f source[path]="/" -f build_type=workflow 2>nul
    
    REM Get username
    for /f "tokens=*" %%i in ('gh api user -q .login') do set GH_USER=%%i
    
    REM Update vite.config.js with correct base path
    echo.
    echo 🔧 מעדכן vite.config.js...
    powershell -Command "(Get-Content vite.config.js) -replace \"base: '/'\", \"base: '/!REPO_NAME!/'\" | Set-Content vite.config.js"
    
    git add vite.config.js
    git commit -m "Update base path for GitHub Pages" 2>nul
    git push 2>nul
    
    echo ✅ vite.config.js עודכן
    
    echo.
    echo ════════════════════════════════════════════════════════════
    echo    ✅ הפרסום הושלם בהצלחה!
    echo ════════════════════════════════════════════════════════════
    echo.
    echo 🌐 הדשבורד שלך יהיה זמין בקרוב ב:
    echo    https://!GH_USER!.github.io/!REPO_NAME!/
    echo.
    echo 📊 מעקב אחר הבנייה:
    echo    https://github.com/!GH_USER!/!REPO_NAME!/actions
    echo.
    echo ⏱️ המתן 2-3 דקות לסיום הבנייה ב-GitHub Actions
    echo.
    echo 💡 טיפ: לעדכון נתונים בעתיד, רוץ:
    echo    deploy.bat new-data.xlsx
    echo.
    
) else (
    REM Manual mode
    echo 📋 מצב ידני - עקוב אחרי ההוראות:
    echo.
    echo 1️⃣ צור repository חדש ב-GitHub:
    echo    https://github.com/new
    echo.
    echo 2️⃣ תן שם ל-repository (לדוגמה: ott-dashboard^)
    echo.
    echo 3️⃣ בחר Public
    echo.
    echo 4️⃣ לחץ "Create repository"
    echo.
    pause
    
    set /p REPO_NAME="הכנס את שם ה-repository שיצרת: "
    set /p GH_USER="הכנס את שם המשתמש שלך ב-GitHub: "
    
    echo.
    echo 📤 שלב 5/7: מאתחל Git ומעלה...
    echo ────────────────────────────────────────────────────────────
    
    if exist ".git" (
        echo ℹ️ Git כבר מאותחל
    ) else (
        git init
        echo ✅ Git אותחל
    )
    
    git add .
    git commit -m "Initial commit: OTT Dashboard v2.2.1 with data" 2>nul
    if errorlevel 1 (
        echo ℹ️ אין שינויים חדשים
    ) else (
        echo ✅ Commit נוצר
    )
    
    git branch -M main
    git remote remove origin 2>nul
    git remote add origin https://github.com/!GH_USER!/!REPO_NAME!.git
    
    echo.
    echo מעלה ל-GitHub...
    git push -u origin main
    if errorlevel 1 (
        echo.
        echo ⚠️ שגיאה בהעלאה
        echo בדוק:
        echo   - שם המשתמש נכון: !GH_USER!
        echo   - שם ה-repo נכון: !REPO_NAME!
        echo   - יש לך הרשאות
        echo.
        pause
        exit /b 1
    )
    echo ✅ הועלה ל-GitHub
    
    echo.
    echo 🔧 שלב 6/7: מעדכן vite.config.js...
    echo ────────────────────────────────────────────────────────────
    
    powershell -Command "(Get-Content vite.config.js) -replace \"base: '/'\", \"base: '/!REPO_NAME!/'\" | Set-Content vite.config.js"
    
    git add vite.config.js
    git commit -m "Update base path for GitHub Pages"
    git push
    echo ✅ vite.config.js עודכן
    
    echo.
    echo ⚙️ שלב 7/7: הגדרת GitHub Pages
    echo ────────────────────────────────────────────────────────────
    echo.
    echo עכשיו לך ל-GitHub ועשה את זה:
    echo.
    echo 1️⃣ לך ל: https://github.com/!GH_USER!/!REPO_NAME!/settings/pages
    echo.
    echo 2️⃣ תחת "Source" בחר: GitHub Actions
    echo.
    echo 3️⃣ שמור
    echo.
    echo 4️⃣ לך ל: https://github.com/!GH_USER!/!REPO_NAME!/actions
    echo.
    echo 5️⃣ בדוק שה-workflow רץ והצליח (ירוק^)
    echo.
    pause
    
    echo.
    echo ════════════════════════════════════════════════════════════
    echo    ✅ הפרסום הושלם!
    echo ════════════════════════════════════════════════════════════
    echo.
    echo 🌐 הדשבורד שלך יהיה זמין ב:
    echo    https://!GH_USER!.github.io/!REPO_NAME!/
    echo.
    echo ⏱️ המתן 2-3 דקות לסיום הבנייה
    echo.
)

echo 🎊 בהצלחה!
echo.
pause

