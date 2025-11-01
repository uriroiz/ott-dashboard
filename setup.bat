@echo off
chcp 65001 >nul
echo ========================================
echo התקנת דשבורד נתוני OTT
echo ========================================
echo.

echo [1/3] בודק אם Node.js מותקן...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js לא מותקן!
    echo אנא התקן Node.js מהאתר: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js מותקן

echo.
echo [2/3] מתקין תלויות...
call npm install
if %errorlevel% neq 0 (
    echo ❌ שגיאה בהתקנת תלויות
    pause
    exit /b 1
)
echo ✅ התלויות הותקנו בהצלחה

echo.
echo [3/3] בניית הפרויקט...
echo.
echo ========================================
echo ההתקנה הושלמה בהצלחה! ✅
echo ========================================
echo.
echo להפעלת הדשבורד הקלד:
echo   npm run dev
echo.
echo או הפעל את הקובץ: start.bat
echo.
pause

