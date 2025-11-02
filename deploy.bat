@echo off
chcp 65001 > nul
echo ========================================
echo    🚀 IBBA OTT Dashboard - Deploy
echo ========================================
echo.

REM Check if Excel file provided
if "%~1"=="" (
    echo ❌ שגיאה: לא סופק קובץ Excel
    echo.
    echo שימוש:
    echo    deploy.bat ^<קובץ-Excel^>
    echo.
    echo דוגמה:
    echo    deploy.bat monthly-report.xlsx
    echo.
    pause
    exit /b 1
)

set EXCEL_FILE=%~1
set JSON_OUTPUT=public\data\ott-data.json

REM Check if Excel file exists
if not exist "%EXCEL_FILE%" (
    echo ❌ שגיאה: הקובץ %EXCEL_FILE% לא נמצא
    echo.
    pause
    exit /b 1
)

echo 📊 שלב 1/4: ממיר Excel ל-JSON...
call npm run excel-to-json "%EXCEL_FILE%" "%JSON_OUTPUT%"
if errorlevel 1 (
    echo ❌ שגיאה בהמרת הקובץ
    pause
    exit /b 1
)
echo ✅ המרה הושלמה
echo.

echo 🔨 שלב 2/4: בונה את הדשבורד...
call npm run build
if errorlevel 1 (
    echo ❌ שגיאה בבנייה
    pause
    exit /b 1
)
echo ✅ בנייה הושלמה
echo.

echo 📝 שלב 3/4: מעלה ל-Git...
git add "%JSON_OUTPUT%"
git add dist
git status
echo.

set /p COMMIT_MSG="הכנס הודעת commit (או Enter לברירת מחדל): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Update data - %date%

git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
    echo ℹ️ אין שינויים לעדכן או שגיאה ב-commit
)
echo.

echo 🚀 שלב 4/4: דוחף ל-GitHub...
git push
if errorlevel 1 (
    echo ❌ שגיאה ב-push
    echo בדוק שיש לך גישה ל-repository
    pause
    exit /b 1
)
echo.

echo ========================================
echo ✅ הדפלוי הושלם בהצלחה!
echo ========================================
echo.
echo 🌐 הדשבורד יתעדכן תוך 2-3 דקות ב:
echo    https://[USERNAME].github.io/[REPO]/
echo.
echo 📊 בדוק את GitHub Actions:
echo    https://github.com/[USERNAME]/[REPO]/actions
echo.
pause


