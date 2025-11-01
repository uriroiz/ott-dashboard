# 🚀 Quick Publishing Guide - GitHub Pages

## ⚡ Fast Track: 2 Commands

```bash
# 1. Convert your Excel file to JSON
npm run convert your-data.xlsx

# 2. Publish to GitHub
publish-to-github.bat
```

**That's it!** 🎉

---

## 📋 What the Script Does

### Automatic Mode (with GitHub CLI):
1. ✅ Checks Git, Node.js installed
2. ✅ Creates .env files
3. ✅ Builds the dashboard
4. ✅ Creates GitHub repository
5. ✅ Pushes code to GitHub
6. ✅ Configures GitHub Pages
7. ✅ Gives you the URL

**Time: ~2 minutes**

### Manual Mode (without GitHub CLI):
1. ✅ Checks Git, Node.js installed
2. ✅ Creates .env files
3. ✅ Builds the dashboard
4. ℹ️ Guides you to create repository
5. ✅ Pushes code to GitHub
6. ℹ️ Tells you how to enable GitHub Pages
7. ✅ Gives you the URL

**Time: ~5 minutes**

---

## 🎯 Two Modes

### Mode 1: With GitHub CLI (Recommended!)

**Install GitHub CLI:**
```bash
winget install --id GitHub.cli
```

**Login:**
```bash
gh auth login
```

**Publish:**
```bash
publish-to-github.bat
```

**Done!** Everything happens automatically.

---

### Mode 2: Without GitHub CLI

**Publish:**
```bash
publish-to-github.bat
```

The script will:
1. Tell you to create a repository at: https://github.com/new
2. Wait for you to do it
3. Push the code
4. Tell you how to enable GitHub Pages
5. Done!

---

## 🐛 Troubleshooting

### Script Stops at "Checking Prerequisites"

**Issue:** Git not installed
```bash
# Install Git
# Download from: https://git-scm.com/download/win
```

**Issue:** Node.js not installed
```bash
# Install Node.js
# Download from: https://nodejs.org/
```

---

### Script Stops at "Creating .env Files"

This shouldn't fail, but if it does:
```bash
# Manually create these files in ott-dashboard folder:

# .env.development
VITE_PRODUCTION_MODE=false

# .env.production
VITE_PRODUCTION_MODE=true
VITE_DATA_FILE=/data/ott-data.json

# .env.example
VITE_PRODUCTION_MODE=true
VITE_DATA_FILE=/data/ott-data.json
```

---

### Script Stops at "Building for Production"

**Issue:** Build errors

Check the error message. Common fixes:
```bash
# Clean install
rm -rf node_modules
npm install

# Try build again
npm run build
```

---

### Script Stops at "Creating GitHub Repository"

**Issue:** Not authenticated
```bash
gh auth login
# Follow the prompts
```

**Issue:** Repository already exists
- That's OK! The script will update it
- Or use a different name

---

### Script Stops at "Uploading Files"

**Issue:** Push failed

```bash
# Check authentication
gh auth status

# Or for manual mode, you may need a Personal Access Token
# Go to: https://github.com/settings/tokens
# Create a token with 'repo' permissions
# Use it as password when pushing
```

---

### Script Completes but Dashboard Shows 404

**Solutions:**

1. **Wait longer** - First deployment takes 3-5 minutes
2. **Check GitHub Actions**
   - Go to: https://github.com/YOUR-USER/YOUR-REPO/actions
   - Make sure the workflow succeeded (green checkmark)
3. **Check GitHub Pages is enabled**
   - Go to: Settings → Pages
   - Source should be: **GitHub Actions**
4. **Check vite.config.js**
   - `base` should be: `'/your-repo-name/'`

---

## 📊 Step-by-Step (Manual Mode)

### Step 1: Prepare Data
```bash
cd ott-dashboard
npm run convert basketball_data.xlsx
```
**Expected:** `✅ Successfully converted to JSON!`

---

### Step 2: Run Publisher
```bash
publish-to-github.bat
```

---

### Step 3: Create Repository
When prompted:
1. Browser opens: https://github.com/new
2. Repository name: `ott-dashboard` (or your choice)
3. Select: **Public**
4. Click: **Create repository**
5. Go back to terminal, press Enter

---

### Step 4: Enter Details
```
Enter the repository name you created: ott-dashboard
Enter your GitHub username: your-username
```

---

### Step 5: Wait for Push
Script will push code to GitHub.

**If it asks for credentials:**
- Username: your-github-username
- Password: your-personal-access-token (NOT your GitHub password!)

**Get a token:** https://github.com/settings/tokens

---

### Step 6: Enable GitHub Pages
Script will show you:
```
1️⃣ Go to: https://github.com/YOU/ott-dashboard/settings/pages
2️⃣ Under "Source" select: GitHub Actions
3️⃣ Click Save
```

Do that, then press Enter.

---

### Step 7: Done!
```
🌐 Your dashboard will be available at:
   https://your-username.github.io/ott-dashboard/

⏱️ Wait 2-3 minutes for the build to complete
```

---

## 🔄 Updating Data (After Initial Publish)

### Quick Update:
```bash
deploy.bat new-data.xlsx
```

### Manual Update:
```bash
npm run convert new-data.xlsx
git add public/data/ott-data.json
git commit -m "Update data"
git push
```

GitHub Actions will automatically rebuild and deploy!

---

## ✅ Success Checklist

After running the script:

- [ ] Script completed without errors
- [ ] Got a URL: `https://USER.github.io/REPO/`
- [ ] Repository exists on GitHub
- [ ] GitHub Pages enabled (Settings → Pages)
- [ ] GitHub Actions workflow ran (Actions tab)
- [ ] Workflow succeeded (green checkmark)
- [ ] Dashboard loads at the URL
- [ ] Data displays correctly

If all checked ✅ - **You're live!** 🎉

---

## 💡 Pro Tips

### Tip 1: Install GitHub CLI
Makes everything automatic:
```bash
winget install --id GitHub.cli
gh auth login
```

### Tip 2: Use SSH
Avoids password prompts:
```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub
# Go to: https://github.com/settings/keys
# Add the contents of: ~/.ssh/id_ed25519.pub
```

### Tip 3: Custom Domain
Want `dashboard.yourdomain.com`?

1. Add CNAME file to `public/`:
   ```
   dashboard.yourdomain.com
   ```
2. Update DNS:
   ```
   CNAME  dashboard  YOUR-USERNAME.github.io
   ```
3. Enable in GitHub: Settings → Pages → Custom domain

---

## 📞 Still Having Issues?

### Check these files:
1. `ott-dashboard/dist/` - Should exist after build
2. `ott-dashboard/public/data/ott-data.json` - Should have your data
3. `.env.production` - Should exist

### View logs:
```bash
# Local build log
npm run build

# GitHub Actions log
# Go to: https://github.com/USER/REPO/actions
# Click on the workflow run
# View the logs
```

### Common URLs to check:
- Repository: `https://github.com/USER/REPO`
- Settings: `https://github.com/USER/REPO/settings`
- Pages: `https://github.com/USER/REPO/settings/pages`
- Actions: `https://github.com/USER/REPO/actions`
- Dashboard: `https://USER.github.io/REPO/`

---

## 🎯 Summary

```bash
# One-time setup
npm install
npm run convert your-data.xlsx

# Publish
publish-to-github.bat

# Future updates
deploy.bat new-data.xlsx
```

**That's all!** 🚀

Your dashboard is now live and accessible to anyone with the URL!

---

**Version:** 2.2.1  
**Last Updated:** November 2025  
**Status:** Ready to Use ✅

