# 🚀 מדריך פרסום אוטומטי ל-GitHub Pages

## 📦 יש לך 2 כלים לפרסום אוטומטי!

---

## 🎯 אופציה 1: סקריפט Batch (מומלץ ל-Windows)

### שימוש:
```bash
cd ott-dashboard
publish-github.bat
```

### מה הסקריפט עושה?

1. ✅ **בודק דרישות מוקדמות**
   - Git מותקן
   - Node.js מותקן
   - קובץ נתונים קיים

2. ✅ **יוצר קבצי .env אוטומטית**
   - `.env.development`
   - `.env.production`
   - `.env.example`

3. ✅ **בונה את הדשבורד**
   - `npm run build`

4. ✅ **מזהה אם יש GitHub CLI**
   - אם יש → פרסום **אוטומטי לחלוטין**
   - אם אין → מנחה אותך צעד אחר צעד

5. ✅ **מפרסם ל-GitHub**
   - יוצר repository (אם יש gh CLI)
   - מאתחל Git
   - עושה commit
   - דוחף לGitHub
   - מעדכן `vite.config.js`
   - מגדיר GitHub Pages

6. ✅ **נותן לך קישור**
   - URL לדשבורד
   - קישור למעקב אחר הבנייה

---

## 🎯 אופציה 2: סקריפט PowerShell

### שימוש:
```powershell
cd ott-dashboard
powershell -ExecutionPolicy Bypass -File setup-github.ps1
```

**או:**
```powershell
.\setup-github.ps1
```

### תכונות:
- צבעוני ונוח לקריאה
- מנחה צעד אחר צעד
- יוצר קבצי .env
- מעדכן vite.config.js אוטומטית

---

## 🌟 פרסום אוטומטי מלא עם GitHub CLI

### התקנת GitHub CLI (אופציונלי):

#### Windows:
```powershell
winget install --id GitHub.cli
```

או הורד מ: https://cli.github.com/

#### אחרי ההתקנה:
```bash
# התחבר לGitHub
gh auth login

# רוץ את הסקריפט
publish-github.bat
```

### יתרונות עם GitHub CLI:
- ✅ יוצר repository אוטומטית
- ✅ מגדיר GitHub Pages אוטומטית
- ✅ פחות צעדים ידניים
- ✅ מהיר יותר!

---

## 📋 תהליך פרסום (מצב ידני)

אם אין לך GitHub CLI, הסקריפט ינחה אותך:

### שלב 1: צור Repository
```
→ הסקריפט יפתח לך: https://github.com/new
→ תן שם: ott-dashboard (או כל שם)
→ בחר: Public
→ לחץ: Create repository
```

### שלב 2: הסקריפט יעשה את השאר
```
✅ מאתחל Git
✅ מוסיף קבצים
✅ עושה commit
✅ דוחף לGitHub
✅ מעדכן vite.config.js
```

### שלב 3: הגדר GitHub Pages
```
→ הסקריפט יתן לך קישור: https://github.com/USER/REPO/settings/pages
→ תחת "Source" בחר: GitHub Actions
→ שמור
```

### שלב 4: המתן 2-3 דקות
```
→ הסקריפט יתן לך קישור: https://github.com/USER/REPO/actions
→ בדוק שהworkflow מסתיים (ירוק)
→ הדשבורד חי!
```

---

## 🔄 עדכון נתונים (לאחר הפרסום הראשוני)

### אוטומטי:
```bash
deploy.bat new-data.xlsx
```

### ידני:
```bash
npm run convert new-data.xlsx
git add public/data/ott-data.json
git commit -m "Update data"
git push
```

GitHub Actions יבנה וידפלוי אוטומטית תוך 2-3 דקות!

---

## 🎨 מה קורה מאחורי הקלעים?

### קבצים שנוצרים:
```
.env.development          # מצב פיתוח
.env.production           # מצב ייצור
.env.example              # דוגמה
.git/                     # Git repository
```

### שינויים בקוד:
```javascript
// vite.config.js
base: '/your-repo-name/'  // מתעדכן אוטומטית!
```

### GitHub:
```
Repository נוצר
↓
קבצים מועלים
↓
GitHub Actions רץ
↓
דשבורד חי! 🎉
```

---

## 🐛 פתרון בעיות

### בעיה: "Git לא מותקן"
**פתרון:**
```
התקן Git מ: https://git-scm.com/download/win
אחרי התקנה, פתח CMD חדש
```

---

### בעיה: "קובץ נתונים לא קיים"
**פתרון:**
```bash
npm run convert your-file.xlsx
```

---

### בעיה: "שגיאה בהעלאה לGitHub"
**סיבות אפשריות:**
1. Repository לא קיים → צור ב-https://github.com/new
2. שם משתמש שגוי → בדוק כתיב
3. אין הרשאות → התחבר ל-GitHub במערכת

**פתרון:**
```bash
# בדוק שאתה מחובר
gh auth status

# או התחבר
gh auth login
```

---

### בעיה: "GitHub Pages לא עובד"
**פתרון:**
1. לך ל: Settings → Pages
2. ודא: Source = GitHub Actions
3. בדוק: Actions → workflow הצליח (ירוק)
4. המתן 2-3 דקות
5. נקה cache בדפדפן: Ctrl+Shift+R

---

## 📞 צעדים מהירים

### פרסום ראשוני (עם GitHub CLI):
```bash
cd ott-dashboard
npm run convert data.xlsx
publish-github.bat
```
**זמן: ~3 דקות**

### פרסום ראשוני (בלי GitHub CLI):
```bash
cd ott-dashboard
npm run convert data.xlsx
publish-github.bat
```
**זמן: ~5 דקות**

### עדכון נתונים:
```bash
deploy.bat new-data.xlsx
```
**זמן: ~2 דקות**

---

## ✅ Checklist

לפני הפרסום:
- [ ] קובץ Excel מומר ל-JSON
- [ ] Git מותקן
- [ ] Node.js מותקן
- [ ] חשבון GitHub קיים

לאחר הפרסום:
- [ ] GitHub Actions הצליח (ירוק)
- [ ] הדשבורד נגיש ב-URL
- [ ] הנתונים מוצגים נכון
- [ ] אין שגיאות בקונסול

---

## 🎊 סיכום

**כלי אוטומטי מלא:**
```bash
publish-github.bat
```

**עדכונים:**
```bash
deploy.bat new-data.xlsx
```

**תוצאה:**
```
https://YOUR-USERNAME.github.io/YOUR-REPO/
```

**זמן:** 3-5 דקות מתחילה לסוף! 🚀

---

**גרסה:** 2.2.1  
**תאריך:** נובמבר 2025  
**מוכן לשימוש:** ✅

