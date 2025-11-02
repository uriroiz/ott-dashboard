# 🚀 הוראות פריסה ל-GitHub Pages

## שלב 1: הכנת הנתונים

### המרת Excel ל-JSON

```bash
# המר את קובץ ה-Excel שלך ל-JSON
npm run excel-to-json <your-file.xlsx> public/data/ott-data.json

# דוגמה
npm run excel-to-json monthly-report.xlsx public/data/ott-data.json
```

הסקריפט יצור קובץ JSON ב-`public/data/ott-data.json` עם כל הנתונים.

---

## שלב 2: בנייה לייצור

```bash
# בנה את הדשבורד
npm run build
```

זה יצור תיקיית `dist/` עם כל הקבצים הסטטיים.

---

## שלב 3: העלאה ל-GitHub

### 3.1 צור repository חדש ב-GitHub

1. לך ל-GitHub.com
2. לחץ על "New repository"
3. תן שם לrepository (למשל: `ott-dashboard`)
4. **אל תוסיף** README, .gitignore, או License (כבר יש)

### 3.2 אתחל Git והעלה

```bash
# התקן git (אם עדיין לא)
cd ott-dashboard

# אתחל git
git init

# הוסף את כל הקבצים
git add .

# Commit ראשון
git commit -m "Initial commit: OTT Dashboard v2.2.1"

# קשר ל-GitHub (החלף USERNAME ו-REPO)
git remote add origin https://github.com/USERNAME/REPO.git

# דחוף ל-GitHub
git branch -M main
git push -u origin main
```

---

## שלב 4: הפעלת GitHub Pages

### אופציה 1: GitHub Actions (מומלץ)

צור קובץ `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

**הפעל ב-GitHub:**
1. Settings → Pages
2. Source: GitHub Actions
3. שמור ודחוף את הקובץ
4. GitHub Actions יבנה וידפלוי אוטומטית

---

### אופציה 2: gh-pages (ידני)

```bash
# התקן gh-pages
npm install --save-dev gh-pages

# הוסף scripts ל-package.json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}

# דפלוי
npm run deploy
```

**הפעל ב-GitHub:**
1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` → `/root`
4. שמור

---

## שלב 5: עדכון vite.config.js

**אם השם של ה-repo לא `ott-dashboard`:**

```javascript
// vite.config.js
export default defineConfig({
  base: '/your-repo-name/', // ⬅️ שנה לשם שלך
  // ...
})
```

---

## עדכון נתונים (מדי חודש)

### דרך 1: ידנית

```bash
# 1. המר Excel חדש ל-JSON
npm run excel-to-json new-data.xlsx public/data/ott-data.json

# 2. בנה מחדש
npm run build

# 3. דפלוי (אם משתמש ב-gh-pages)
npm run deploy

# או commit ו-push (אם משתמש ב-Actions)
git add public/data/ott-data.json
git commit -m "Update data for November 2025"
git push
```

---

### דרך 2: אוטומטית (עם GitHub Actions)

יצירת workflow שמעדכן נתונים:

```yaml
# .github/workflows/update-data.yml
name: Update Data

on:
  workflow_dispatch:
    inputs:
      data_file:
        description: 'Excel file URL or upload'
        required: true

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      # Add steps to download/convert Excel
      - run: npm run build
      - run: npm run deploy
```

---

## 🔒 אבטחה ופרטיות

### אל תעלה קבצים רגישים!

הקבצים הבאים **לא יועלו** (לפי .gitignore):

```
✅ *.xlsx, *.xls - קבצי Excel מקוריים
✅ public/data/*.json - קבצי נתונים (חוץ מדוגמה)
✅ .env.local - משתני סביבה מקומיים
```

### המלצות:
1. **בדוק את ה-JSON** לפני העלאה - ודא שאין מידע רגיש
2. **השתמש ב-Private repo** אם הנתונים סודיים
3. **הגבל גישה** - Settings → Manage access

---

## 🌐 גישה לדשבורד

אחרי הדפלוי, הדשבורד יהיה זמין ב:

```
https://USERNAME.github.io/REPO-NAME/
```

**דוגמה:**
```
https://ibba.github.io/ott-dashboard/
```

---

## 🔄 תהליך עבודה מומלץ

### מצב פיתוח (מקומי)
```bash
npm run dev
# → העלה Excel ידנית, בדוק שינויים
```

### מצב ייצור (GitHub)
```bash
npm run excel-to-json data.xlsx public/data/ott-data.json
npm run build
git add .
git commit -m "Update data"
git push
# → GitHub Actions בונה ומדפלס אוטומטית
```

---

## 🐛 פתרון בעיות

### הדשבורד לא טוען נתונים

**בדוק:**
1. `public/data/ott-data.json` קיים?
2. `vite.config.js` - base נכון?
3. Console ב-DevTools - שגיאות?

**פתרון:**
```bash
# בדוק שהקובץ קיים
ls public/data/ott-data.json

# ודא ש-JSON תקין
cat public/data/ott-data.json | jq .

# בנה מחדש
npm run build
```

---

### 404 Page Not Found

**בעיה:** `base` ב-vite.config.js לא נכון

**פתרון:**
```javascript
// vite.config.js
base: '/your-actual-repo-name/'  // ⬅️ שנה!
```

---

### נתונים לא מתעדכנים

**פתרון:**
1. נקה cache: Ctrl+Shift+R (Hard Refresh)
2. ודא ש-GitHub Actions הסתיים בהצלחה
3. המתן 2-3 דקות לעיכול

---

## 📞 תמיכה

**בעיות נפוצות:**
- **נתונים לא נטענים:** בדוק Console ב-DevTools
- **404 Error:** תקן `base` ב-vite.config.js
- **עיצוב שבור:** ודא ש-build הצליח

**משאבים:**
- [GitHub Pages Docs](https://docs.github.com/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**גרסה:** 2.2.1  
**עודכן:** נובמבר 2025  
**מצב:** מוכן לייצור ✅


