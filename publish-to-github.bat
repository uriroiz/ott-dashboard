@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

echo ================================================================
echo    🚀 IBBA OTT Dashboard - Automatic GitHub Pages Publishing
echo ================================================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ ERROR: Script must run from ott-dashboard directory
    echo.
    echo Current directory: %CD%
    echo Please run: cd ott-dashboard
    echo.
    pause
    exit /b 1
)

echo 📋 Step 1/7: Checking Prerequisites
echo ----------------------------------------------------------------

REM Check Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed
    echo.
    echo Install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo ✅ Git installed

REM Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed
    echo.
    echo Install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js installed

REM Check if node_modules exists
if not exist "node_modules" (
    echo ⚠️ node_modules not found, installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Error installing dependencies
        pause
        exit /b 1
    )
)
echo ✅ Dependencies installed

REM Check if JSON data exists
if not exist "public\data\ott-data.json" (
    echo.
    echo ❌ Data file not found: public\data\ott-data.json
    echo.
    echo Run first:
    echo    npm run convert your-file.xlsx
    echo.
    pause
    exit /b 1
)
echo ✅ Data file exists
echo.

echo 📝 Step 2/7: Creating .env Files
echo ----------------------------------------------------------------

REM Create .env.development
if not exist ".env.development" (
    echo VITE_PRODUCTION_MODE=false > .env.development
    echo ✅ Created: .env.development
) else (
    echo ℹ️ Exists: .env.development
)

REM Create .env.production
if not exist ".env.production" (
    (
        echo VITE_PRODUCTION_MODE=true
        echo VITE_DATA_FILE=/data/ott-data.json
    ) > .env.production
    echo ✅ Created: .env.production
) else (
    echo ℹ️ Exists: .env.production
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
    echo ✅ Created: .env.example
) else (
    echo ℹ️ Exists: .env.example
)
echo.

echo 🔨 Step 3/7: Building for Production
echo ----------------------------------------------------------------
echo Building... (this may take 30-60 seconds)
echo.
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ Build failed!
    echo.
    echo Common issues:
    echo   - Missing dependencies: npm install
    echo   - Syntax errors in code
    echo   - Check error messages above
    echo.
    pause
    exit /b 1
)
echo ✅ Build completed successfully
echo.

echo 📊 Step 4/7: GitHub Configuration
echo ----------------------------------------------------------------

REM Check if gh CLI is installed
gh --version >nul 2>&1
if errorlevel 1 (
    set USE_GH=0
    echo ℹ️ GitHub CLI not installed - Manual mode
    echo.
    echo 💡 TIP: Install GitHub CLI for automatic publishing:
    echo    winget install --id GitHub.cli
    echo    Then run: gh auth login
    echo.
) else (
    set USE_GH=1
    echo ✅ GitHub CLI installed
    
    REM Check if authenticated
    gh auth status >nul 2>&1
    if errorlevel 1 (
        echo ⚠️ Not authenticated with GitHub CLI
        echo.
        echo Please run first: gh auth login
        echo.
        set /p CONTINUE="Continue in manual mode? (Y/N): "
        if /i "!CONTINUE!" neq "Y" (
            echo.
            echo Run: gh auth login
            echo Then run this script again
            pause
            exit /b 1
        )
        set USE_GH=0
    ) else (
        echo ✅ GitHub CLI authenticated
    )
)
echo.

if !USE_GH!==1 (
    echo 🎯 Using GitHub CLI for Automatic Publishing
    echo.
    
    REM Get repo name
    set /p REPO_NAME="Enter repository name (default: ott-dashboard): "
    if "!REPO_NAME!"=="" set REPO_NAME=ott-dashboard
    
    echo.
    echo Using repository name: !REPO_NAME!
    echo.
    
    echo 📦 Step 5/7: Creating GitHub Repository...
    echo ----------------------------------------------------------------
    
    REM Check if already initialized
    if exist ".git" (
        echo ℹ️ Git already initialized
    ) else (
        git init
        echo ✅ Git initialized
    )
    
    REM Get username
    for /f "tokens=*" %%i in ('gh api user -q .login 2^>nul') do set GH_USER=%%i
    if "!GH_USER!"=="" (
        echo ❌ Could not get GitHub username
        echo Please check: gh auth status
        pause
        exit /b 1
    )
    echo GitHub User: !GH_USER!
    
    REM Create GitHub repo
    echo Creating repository on GitHub...
    gh repo create !REPO_NAME! --public --source=. --remote=origin --push >nul 2>&1
    if errorlevel 1 (
        echo.
        echo ⚠️ Repository creation failed (might already exist)
        echo Checking if repository exists...
        
        REM Try to access the repo
        gh repo view !GH_USER!/!REPO_NAME! >nul 2>&1
        if errorlevel 1 (
            echo ❌ Repository does not exist and couldn't be created
            echo.
            echo Please create it manually:
            echo 1. Go to: https://github.com/new
            echo 2. Name: !REPO_NAME!
            echo 3. Set to Public
            echo 4. Click "Create repository"
            echo.
            pause
            
            REM Continue with manual push
            git remote remove origin 2>nul
            git remote add origin https://github.com/!GH_USER!/!REPO_NAME!.git
        ) else (
            echo ℹ️ Repository already exists, will update it
            git remote remove origin 2>nul
            git remote add origin https://github.com/!GH_USER!/!REPO_NAME!.git
        )
    ) else (
        echo ✅ Repository created successfully
    )
    
    echo.
    echo 📤 Step 6/7: Uploading Files...
    echo ----------------------------------------------------------------
    
    git add .
    git commit -m "Initial commit: OTT Dashboard v2.2.1 with data" 2>nul
    if errorlevel 1 (
        echo ℹ️ No new changes or already committed
    ) else (
        echo ✅ Commit created
    )
    
    git branch -M main 2>nul
    
    echo Pushing to GitHub...
    git push -u origin main --force 2>nul
    if errorlevel 1 (
        echo ⚠️ Push might have failed, trying without force...
        git push -u origin main
        if errorlevel 1 (
            echo ❌ Push failed
            echo.
            echo Check:
            echo   - GitHub username: !GH_USER!
            echo   - Repository name: !REPO_NAME!
            echo   - Authentication: gh auth status
            echo.
            pause
            exit /b 1
        )
    )
    echo ✅ Pushed to GitHub
    
    echo.
    echo ⚙️ Step 7/7: Configuring GitHub Pages...
    echo ----------------------------------------------------------------
    
    REM Update vite.config.js with correct base path
    echo Updating vite.config.js...
    powershell -Command "(Get-Content vite.config.js) -replace 'base: ''/'',', 'base: ''/!REPO_NAME!/'',' | Set-Content vite.config.js" 2>nul
    
    git add vite.config.js
    git commit -m "Update base path for GitHub Pages" 2>nul
    if errorlevel 1 (
        echo ℹ️ vite.config.js already updated or no changes
    ) else (
        git push 2>nul
        echo ✅ vite.config.js updated
    )
    
    REM Enable GitHub Pages with GitHub Actions
    echo Enabling GitHub Pages...
    gh api -X PUT "repos/!GH_USER!/!REPO_NAME!/pages" -f build_type=workflow 2>nul
    if errorlevel 1 (
        echo ⚠️ Could not auto-enable GitHub Pages
        echo Please enable manually:
        echo 1. Go to: https://github.com/!GH_USER!/!REPO_NAME!/settings/pages
        echo 2. Under "Source" select: GitHub Actions
        echo 3. Click Save
    ) else (
        echo ✅ GitHub Pages enabled
    )
    
    echo.
    echo ================================================================
    echo    ✅ Publishing Completed Successfully!
    echo ================================================================
    echo.
    echo 🌐 Your dashboard will be available soon at:
    echo    https://!GH_USER!.github.io/!REPO_NAME!/
    echo.
    echo 📊 Monitor the build process:
    echo    https://github.com/!GH_USER!/!REPO_NAME!/actions
    echo.
    echo ⏱️ Wait 2-3 minutes for GitHub Actions to finish building
    echo.
    echo 💡 TIP: To update data in the future, run:
    echo    deploy.bat new-data.xlsx
    echo.
    
) else (
    REM Manual mode
    echo 📋 Manual Mode - Follow These Instructions:
    echo.
    echo 1️⃣ Create a new repository on GitHub:
    echo    https://github.com/new
    echo.
    echo 2️⃣ Give it a name (example: ott-dashboard)
    echo.
    echo 3️⃣ Select Public
    echo.
    echo 4️⃣ Click "Create repository"
    echo.
    echo ⏸️ After creating the repository, press any key to continue...
    pause >nul
    
    set /p REPO_NAME="Enter the repository name you created: "
    set /p GH_USER="Enter your GitHub username: "
    
    if "!REPO_NAME!"=="" (
        echo ❌ Repository name is required
        pause
        exit /b 1
    )
    
    if "!GH_USER!"=="" (
        echo ❌ GitHub username is required
        pause
        exit /b 1
    )
    
    echo.
    echo Using:
    echo   Username: !GH_USER!
    echo   Repository: !REPO_NAME!
    echo.
    
    echo 📤 Step 5/7: Initializing Git and Uploading...
    echo ----------------------------------------------------------------
    
    if exist ".git" (
        echo ℹ️ Git already initialized
    ) else (
        git init
        echo ✅ Git initialized
    )
    
    git add .
    git commit -m "Initial commit: OTT Dashboard v2.2.1 with data" 2>nul
    if errorlevel 1 (
        echo ℹ️ No new changes
    ) else (
        echo ✅ Commit created
    )
    
    git branch -M main
    git remote remove origin 2>nul
    git remote add origin https://github.com/!GH_USER!/!REPO_NAME!.git
    
    echo.
    echo Pushing to GitHub...
    echo (You may need to enter your GitHub credentials)
    echo.
    git push -u origin main
    if errorlevel 1 (
        echo.
        echo ❌ Push failed
        echo.
        echo Check:
        echo   - Username is correct: !GH_USER!
        echo   - Repository name is correct: !REPO_NAME!
        echo   - Repository exists: https://github.com/!GH_USER!/!REPO_NAME!
        echo   - You have permissions
        echo.
        echo If the repository doesn't exist, create it first at:
        echo https://github.com/new
        echo.
        pause
        exit /b 1
    )
    echo ✅ Pushed to GitHub
    
    echo.
    echo 🔧 Step 6/7: Updating vite.config.js...
    echo ----------------------------------------------------------------
    
    powershell -Command "(Get-Content vite.config.js) -replace 'base: ''/'',', 'base: ''/!REPO_NAME!/'',' | Set-Content vite.config.js"
    
    git add vite.config.js
    git commit -m "Update base path for GitHub Pages"
    git push
    echo ✅ vite.config.js updated
    
    echo.
    echo ⚙️ Step 7/7: GitHub Pages Configuration
    echo ----------------------------------------------------------------
    echo.
    echo Now go to GitHub and do this:
    echo.
    echo 1️⃣ Go to: https://github.com/!GH_USER!/!REPO_NAME!/settings/pages
    echo.
    echo 2️⃣ Under "Source" select: GitHub Actions
    echo.
    echo 3️⃣ Click Save
    echo.
    echo 4️⃣ Go to: https://github.com/!GH_USER!/!REPO_NAME!/actions
    echo.
    echo 5️⃣ Check that the workflow runs and succeeds (green checkmark)
    echo.
    echo ⏸️ Press any key after you've done the above steps...
    pause >nul
    
    echo.
    echo ================================================================
    echo    ✅ Publishing Complete!
    echo ================================================================
    echo.
    echo 🌐 Your dashboard will be available at:
    echo    https://!GH_USER!.github.io/!REPO_NAME!/
    echo.
    echo ⏱️ Wait 2-3 minutes for the build to complete
    echo.
)

echo 🎊 Success! Your dashboard is being published.
echo.
echo 📖 Troubleshooting:
echo    - If you see a 404, wait a few more minutes
echo    - Check GitHub Actions for build status
echo    - Verify GitHub Pages is enabled in Settings
echo.
pause

