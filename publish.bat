@echo off
echo.
echo ============================================================
echo          Publish to Vercel - OTT Dashboard
echo ============================================================
echo.

REM Check if we're on dev branch
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i

if not "%CURRENT_BRANCH%"=="dev" (
    echo WARNING: You are not on dev branch!
    echo          You are on branch: %CURRENT_BRANCH%
    echo.
    set /p CONTINUE="Continue anyway? (y/n): "
    if /i not "%CONTINUE%"=="y" (
        echo CANCELLED
        pause
        exit /b 1
    )
)

echo Final Check Before Publishing
echo ------------------------------------------------------------
echo.
echo WARNING: This will publish the data to Vercel!
echo          Clients will be able to see the changes in 2-3 minutes.
echo.
set /p CONFIRM="Are you sure everything looks good? (y/n): "

if /i not "%CONFIRM%"=="y" (
    echo CANCELLED: Publishing cancelled
    echo           Continue testing locally with test-local.bat
    pause
    exit /b 0
)

echo.
echo Step 1: Saving Changes to Dev Branch
echo ------------------------------------------------------------
echo.

git add .
git status

echo.
set /p COMMIT_MSG="Enter commit message (or press Enter for default): "

if "%COMMIT_MSG%"=="" (
    set COMMIT_MSG=Update: Monthly data update
)

git commit -m "%COMMIT_MSG%"

if errorlevel 1 (
    echo WARNING: No new changes, skipping...
) else (
    echo SUCCESS: Changes saved to dev branch
)

echo.
echo Step 2: Push to GitHub (dev branch)
echo ------------------------------------------------------------
echo.

git push origin dev

if errorlevel 1 (
    echo ERROR: Failed to push to GitHub
    pause
    exit /b 1
)

echo SUCCESS: Dev branch pushed to GitHub
echo.

echo Step 3: Switch to Main and Merge
echo ------------------------------------------------------------
echo.

echo Switching to main branch...
git checkout main

if errorlevel 1 (
    echo ERROR: Failed to switch to main
    pause
    exit /b 1
)

echo Updating main from GitHub...
git pull origin main

if errorlevel 1 (
    echo ERROR: Failed to update main
    pause
    exit /b 1
)

echo Merging dev into main...
git merge dev -m "Merge dev to main: %COMMIT_MSG%"

if errorlevel 1 (
    echo ERROR: Merge failed
    echo        There might be conflicts that need to be resolved manually
    pause
    exit /b 1
)

echo SUCCESS: Merge completed!
echo.

echo Step 4: Publishing to Vercel
echo ------------------------------------------------------------
echo.

echo Pushing to GitHub (main branch)...
git push origin main

if errorlevel 1 (
    echo ERROR: Failed to push to GitHub
    pause
    exit /b 1
)

echo SUCCESS: Pushed to GitHub successfully!
echo.

echo Returning to dev branch for next update...
git checkout dev

echo.
echo ============================================================
echo                    SUCCESS!
echo ============================================================
echo.
echo Data published to Vercel!
echo.
echo What happens now:
echo    - Vercel is building the site (1-2 minutes)
echo    - https://ott-dashboard.vercel.app/ will update automatically
echo.
echo Check Vercel Dashboard:
echo    https://vercel.com/dashboard
echo.
echo You're back on dev branch for the next update
echo.
pause

