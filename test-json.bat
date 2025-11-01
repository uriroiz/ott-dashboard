@echo off
chcp 65001 > nul
echo ========================================
echo    🧪 Test JSON Data Loading
echo ========================================
echo.

REM Check if ott-data.json exists
if not exist "public\data\ott-data.json" (
    echo ❌ קובץ ott-data.json לא נמצא
    echo.
    echo האם תרצה להשתמש בדוגמה?
    echo 1. כן - העתק example.json
    echo 2. לא - צא
    echo.
    choice /c 12 /n /m "בחר (1/2): "
    
    if errorlevel 2 exit /b
    if errorlevel 1 (
        copy "public\data\example.json" "public\data\ott-data.json"
        echo ✅ הועתק example.json
        echo.
    )
)

echo 📊 בודק את הקובץ...
echo.

REM Show file size
for %%A in ("public\data\ott-data.json") do (
    echo גודל קובץ: %%~zA bytes
)
echo.

REM Try to validate JSON (requires jq or PowerShell)
echo 🔍 מאמת JSON...
powershell -Command "try { $json = Get-Content 'public\data\ott-data.json' -Raw | ConvertFrom-Json; Write-Host '✅ JSON תקין'; Write-Host 'מספר שורות:' $json.data.Count } catch { Write-Host '❌ JSON לא תקין:' $_.Exception.Message }"
echo.

echo 🚀 מפעיל שרת לבדיקה...
echo.
echo פתח דפדפן ב: http://localhost:3000
echo.
echo לסיום: Ctrl+C
echo.
call npm run dev

pause

