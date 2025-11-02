@echo off
echo.
echo ============================================================
echo          Local Testing - OTT Dashboard
echo ============================================================
echo.

REM Check if we're on dev branch
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i

if not "%CURRENT_BRANCH%"=="dev" (
    echo WARNING: You are not on dev branch!
    echo          Switching to dev branch...
    git checkout dev
    if errorlevel 1 (
        echo ERROR: Failed to switch to dev branch
        pause
        exit /b 1
    )
    echo SUCCESS: Switched to dev branch
    echo.
)

echo Step 1: Convert Excel to JSON
echo ------------------------------------------------------------
echo.

REM Check if Excel file exists
if not exist "basketball_data.xlsx" (
    echo ERROR: basketball_data.xlsx not found!
    echo        Make sure the file is in the project directory.
    pause
    exit /b 1
)

echo Converting basketball_data.xlsx to JSON...
node convert.cjs basketball_data.xlsx public/data/ott-data.json

if errorlevel 1 (
    echo ERROR: Conversion failed!
    pause
    exit /b 1
)

echo SUCCESS: Conversion completed!
echo.

echo Step 2: Save to Git (local only)
echo ------------------------------------------------------------
echo.

git add public/data/ott-data.json
git commit -m "Update: Test data on dev branch"

if errorlevel 1 (
    echo WARNING: No new changes or changes already saved
) else (
    echo SUCCESS: Changes saved to Git locally
)

echo.
echo Step 3: Starting Local Server
echo ------------------------------------------------------------
echo.
echo Starting local server...
echo.
echo    The site will open at: http://localhost:3000
echo.
echo    Check the data and make sure everything looks good!
echo.
echo    When you're done:
echo    1. Close the server (Ctrl+C)
echo    2. Run publish.bat to publish to Vercel
echo.
echo ------------------------------------------------------------
echo.

npm run dev

