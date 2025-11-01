@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

echo ================================================================
echo    🔧 GitHub Pages Fix - Empty Page Troubleshooter
echo ================================================================
echo.

REM Get GitHub details
set /p GH_USER="Enter your GitHub username: "
set /p REPO_NAME="Enter your repository name: "

echo.
echo Using:
echo   Username: !GH_USER!
echo   Repository: !REPO_NAME!
echo   Expected URL: https://!GH_USER!.github.io/!REPO_NAME!/
echo.

echo 📋 Checking Issues...
echo ----------------------------------------------------------------
echo.

echo 1️⃣ Checking vite.config.js base path...
findstr /C:"base:" vite.config.js
echo.

echo Current base path shown above. Should be: base: '/!REPO_NAME!/',
echo.

set /p FIX_BASE="Does the base path match your repo name? (Y/N): "
if /i "!FIX_BASE!"=="N" (
    echo.
    echo Fixing vite.config.js...
    powershell -Command "(Get-Content vite.config.js) -replace 'base: ''[^'']*'',', 'base: ''/!REPO_NAME!/'',' | Set-Content vite.config.js"
    echo ✅ Updated vite.config.js
    
    echo.
    echo Committing and pushing...
    git add vite.config.js
    git commit -m "Fix: Update base path to /!REPO_NAME!/"
    git push
    echo ✅ Pushed to GitHub
    echo.
    echo ⏱️ Wait 2-3 minutes for GitHub Actions to rebuild
    echo Then check: https://!GH_USER!.github.io/!REPO_NAME!/
)
echo.

echo 2️⃣ Checking if GitHub Pages is enabled...
echo.
echo Go to: https://github.com/!GH_USER!/!REPO_NAME!/settings/pages
echo.
echo Make sure:
echo   - Source is set to: GitHub Actions
echo   - NOT set to: Deploy from a branch
echo.
pause
echo.

echo 3️⃣ Checking GitHub Actions...
echo.
echo Go to: https://github.com/!GH_USER!/!REPO_NAME!/actions
echo.
echo Check:
echo   - Is there a workflow run?
echo   - Did it succeed (green checkmark)?
echo   - Or did it fail (red X)?
echo.
set /p ACTIONS_STATUS="What do you see? (success/failed/none): "

if /i "!ACTIONS_STATUS!"=="failed" (
    echo.
    echo ❌ Workflow failed. Let's trigger a new build.
    echo.
    echo Creating empty commit to trigger rebuild...
    git commit --allow-empty -m "Trigger GitHub Pages rebuild"
    git push
    echo ✅ Pushed empty commit
    echo.
    echo ⏱️ Wait 2-3 minutes and check Actions again
    echo https://github.com/!GH_USER!/!REPO_NAME!/actions
)

if /i "!ACTIONS_STATUS!"=="none" (
    echo.
    echo ❌ No workflow found. Let's check the workflow file.
    echo.
    if not exist ".github\workflows\deploy.yml" (
        echo ❌ Workflow file missing!
        echo Creating .github/workflows/deploy.yml...
        
        mkdir .github\workflows 2>nul
        
        (
            echo name: Deploy to GitHub Pages
            echo.
            echo on:
            echo   push:
            echo     branches: [ main ]
            echo   workflow_dispatch:
            echo.
            echo permissions:
            echo   contents: read
            echo   pages: write
            echo   id-token: write
            echo.
            echo concurrency:
            echo   group: "pages"
            echo   cancel-in-progress: false
            echo.
            echo jobs:
            echo   build:
            echo     runs-on: ubuntu-latest
            echo.    
            echo     steps:
            echo       - name: Checkout
            echo         uses: actions/checkout@v4
            echo.      
            echo       - name: Setup Node.js
            echo         uses: actions/setup-node@v4
            echo         with:
            echo           node-version: '18'
            echo           cache: 'npm'
            echo.          
            echo       - name: Install dependencies
            echo         run: npm ci
            echo.        
            echo       - name: Build
            echo         run: npm run build
            echo         env:
            echo           VITE_PRODUCTION_MODE: 'true'
            echo           VITE_DATA_FILE: '/data/ott-data.json'
            echo.        
            echo       - name: Setup Pages
            echo         uses: actions/configure-pages@v4
            echo.        
            echo       - name: Upload artifact
            echo         uses: actions/upload-pages-artifact@v3
            echo         with:
            echo           path: './dist'
            echo.
            echo   deploy:
            echo     environment:
            echo       name: github-pages
            echo       url: ${{ steps.deployment.outputs.page_url }}
            echo     runs-on: ubuntu-latest
            echo     needs: build
            echo     steps:
            echo       - name: Deploy to GitHub Pages
            echo         id: deployment
            echo         uses: actions/deploy-pages@v4
        ) > .github\workflows\deploy.yml
        
        echo ✅ Created workflow file
        echo.
        echo Committing and pushing...
        git add .github\workflows\deploy.yml
        git commit -m "Add GitHub Actions workflow"
        git push
        echo ✅ Pushed workflow file
        echo.
        echo ⏱️ Wait 2-3 minutes for the build
    ) else (
        echo ✅ Workflow file exists
        echo But no workflow ran. Let's trigger it...
        git commit --allow-empty -m "Trigger workflow"
        git push
        echo ✅ Triggered workflow
    )
)

echo.
echo 4️⃣ Quick Test Checklist
echo ----------------------------------------------------------------
echo.
echo Check these:
echo.
echo ✓ GitHub Pages enabled: https://github.com/!GH_USER!/!REPO_NAME!/settings/pages
echo   - Source = GitHub Actions ✓
echo.
echo ✓ Workflow succeeded: https://github.com/!GH_USER!/!REPO_NAME!/actions
echo   - Latest run has green checkmark ✓
echo.
echo ✓ vite.config.js has correct base:
echo   - base: '/!REPO_NAME!/' ✓
echo.
echo ✓ Data file exists:
if exist "public\data\ott-data.json" (
    echo   - public\data\ott-data.json ✓
) else (
    echo   - ❌ public\data\ott-data.json MISSING!
    echo.
    echo   Run: npm run convert your-file.xlsx
)
echo.
echo ✓ .env.production exists:
if exist ".env.production" (
    echo   - .env.production ✓
) else (
    echo   - ❌ .env.production MISSING!
    echo.
    echo   Creating it now...
    (
        echo VITE_PRODUCTION_MODE=true
        echo VITE_DATA_FILE=/data/ott-data.json
    ) > .env.production
    echo   ✅ Created .env.production
    git add .env.production
    git commit -m "Add .env.production"
    git push
)
echo.

echo 5️⃣ Browser Cache
echo ----------------------------------------------------------------
echo.
echo If everything above looks good but page still empty:
echo.
echo 1. Hard refresh your browser:
echo    - Chrome/Edge: Ctrl + Shift + R
echo    - Firefox: Ctrl + F5
echo.
echo 2. Try incognito/private mode
echo.
echo 3. Try a different browser
echo.

echo ================================================================
echo    🎯 Next Steps
echo ================================================================
echo.
echo 1. Wait 2-3 minutes if you just pushed changes
echo.
echo 2. Check GitHub Actions completed:
echo    https://github.com/!GH_USER!/!REPO_NAME!/actions
echo.
echo 3. Visit your dashboard:
echo    https://!GH_USER!.github.io/!REPO_NAME!/
echo.
echo 4. If still empty, run this script again
echo.
pause

