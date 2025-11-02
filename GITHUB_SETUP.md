# 📘 מדריך מהיר: העלאה ל-GitHub Pages

## 🎯 סיכום תהליך

1. המר את ה-Excel שלך ל-JSON
2. בנה את הדשבורד
3. העלה ל-GitHub
4. הפעל GitHub Pages
5. הדשבורד חי! 🎉

---

## ⚡ תהליך מהיר (5 דקות)

### שלב 1: הכן את הנתונים

```bash
# 1. שים את קובץ ה-Excel בתיקייה
# דוגמה: monthly-report.xlsx

# 2. המר ל-JSON
npm run excel-to-json monthly-report.xlsx public/data/ott-data.json

# 3. ודא שהקובץ נוצר
dir public\data\ott-data.json
```

✅ **תוצאה:** קובץ `public/data/ott-data.json` עם כל הנתונים

---

### שלב 2: צור קבצי .env

צור **3 קבצים** חדשים בתיקיית `ott-dashboard`:

#### `.env.development` (פיתוח מקומי)
```env
VITE_PRODUCTION_MODE=false
```

#### `.env.production` (GitHub Pages)
```env
VITE_PRODUCTION_MODE=true
VITE_DATA_FILE=/data/ott-data.json
```

#### `.env.example` (תיעוד)
```env
# Production mode - load data from JSON file instead of Excel upload
VITE_PRODUCTION_MODE=true

# Path to JSON data file (relative to public folder)
VITE_DATA_FILE=/data/ott-data.json
```

---

### שלב 3: בדוק מקומית

```bash
# בדוק שזה עובד לפני העלאה
npm run dev
```

ודא ש:
- ✅ העלאת Excel עובדת (מצב פיתוח)
- ✅ הנתונים מוצגים נכון

---

### שלב 4: העלה ל-GitHub

#### 4.1 צור repository חדש ב-GitHub

1. לך ל-https://github.com/new
2. שם: `ott-dashboard` (או כל שם אחר)
3. **Public** אם רוצה שכולם יראו
4. **Private** אם רוצה שרק אתה תשלוט
5. **אל תסמן** שום אופציה אחרת
6. לחץ "Create repository"

#### 4.2 העלה את הקוד

```bash
cd ott-dashboard

# אתחל git
git init

# הוסף הכל
git add .

# Commit ראשון
git commit -m "Initial commit: OTT Dashboard v2.2.1"

# החלף USERNAME ו-REPO בשלך!
git remote add origin https://github.com/USERNAME/REPO.git

# העלה
git branch -M main
git push -u origin main
```

**דוגמה:**
```bash
# אם המשתמש שלך: ibba
# והrepo שלך: ott-dashboard
git remote add origin https://github.com/ibba/ott-dashboard.git
```

---

### שלב 5: הפעל GitHub Pages

#### 5.1 הגדרות ב-GitHub

1. לך ל-repository שלך ב-GitHub
2. לחץ **Settings** (בפס העליון)
3. גלול ל-**Pages** (בתפריט השמאלי)
4. תחת **Source**, בחר: **GitHub Actions**
5. שמור

#### 5.2 עדכן vite.config.js

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  base: '/ott-dashboard/',  // ⬅️ שנה לשם ה-repo שלך!
  // ...
})
```

**חשוב:** אם קראת ל-repo בשם אחר, שנה את זה!

```bash
# שמור את השינוי
git add vite.config.js
git commit -m "Update base path for GitHub Pages"
git push
```

---

### שלב 6: המתן לבנייה

1. לך ל-**Actions** בGitHub
2. תראה workflow "Deploy to GitHub Pages" רץ
3. המתן ~2-3 דקות
4. ✅ כשזה ירוק - הדשבורד חי!

---

## 🌐 הדשבורד שלך זמין!

```
https://USERNAME.github.io/REPO/
```

**דוגמה:**
```
https://ibba.github.io/ott-dashboard/
```

---

## 🔄 עדכון נתונים חודשי

בכל חודש, כשיש נתונים חדשים:

```bash
# 1. המר את ה-Excel החדש
npm run excel-to-json new-month.xlsx public/data/ott-data.json

# 2. בנה (אופציונלי - לבדיקה מקומית)
npm run build
npm run preview

# 3. העלה ל-GitHub
git add public/data/ott-data.json
git commit -m "Update data: November 2025"
git push
```

**זהו!** GitHub Actions יבנה וידפלוי אוטומטית תוך 2-3 דקות.

---

## 🔒 אבטחה חשובה!

### קבצים שלא יועלו (מוגנים ב-.gitignore):

```
✅ *.xlsx, *.xls      - קבצי Excel המקוריים
✅ public/data/*.json - נתונים (חוץ מדוגמה)
✅ .env.local         - הגדרות מקומיות
```

### ⚠️ לפני העלאה - בדוק!

1. פתח את `public/data/ott-data.json`
2. ודא שאין שם מידע רגיש (טלפונים, אימיילים, וכו')
3. אם יש - מחק את השורות הרלוונטיות מה-JSON

---

## 🐛 פתרון בעיות נפוצות

### בעיה: הדשבורד מציג "לא נמצאו נתונים"

**פתרון:**
```bash
# ודא שהקובץ קיים
dir public\data\ott-data.json

# בדוק ש-JSON תקין
type public\data\ott-data.json
```

---

### בעיה: 404 Not Found

**סיבה:** `base` ב-vite.config.js לא נכון

**פתרון:**
```javascript
// vite.config.js
base: '/your-repo-name/',  // ⬅️ צריך להיות בדיוק כמו שם ה-repo!
```

---

### בעיה: העלאת קבצים לא עובדת

**זה נורמלי!** בגרסת GitHub:
- ✅ העלאת Excel **מוסתרת** (רק אתה רואה בפיתוח)
- ✅ לקוחות רואים **רק נתונים מה-JSON**

**לבדיקה מקומית:**
```bash
npm run dev
# → יש העלאת Excel

npm run build
npm run preview
# → אין העלאת Excel (כמו GitHub)
```

---

## 📞 עזרה

### בעיות בבנייה?

```bash
# נקה והתקן מחדש
rmdir /s node_modules
del package-lock.json
npm install

# נסה שוב
npm run build
```

### בעיות בGitHub Actions?

1. לך ל-**Actions** ב-GitHub
2. לחץ על ה-workflow האדום
3. בדוק את ה-logs לשגיאות
4. העתק את השגיאה וחפש בGoogle או שאל אותי

---

## ✅ Checklist

לפני שמסיימים:

- [ ] קובץ JSON נוצר: `public/data/ott-data.json`
- [ ] יצרתי 3 קבצי .env
- [ ] בדקתי מקומית: `npm run dev`
- [ ] יצרתי repository ב-GitHub
- [ ] העליתי את הקוד: `git push`
- [ ] הפעלתי GitHub Pages (Actions)
- [ ] שיניתי `base` ב-vite.config.js
- [ ] GitHub Actions הסתיים בהצלחה (ירוק)
- [ ] הדשבורד חי באינטרנט! 🎉

---

## 📚 קבצים חשובים

| קובץ | מטרה |
|------|------|
| `public/data/ott-data.json` | הנתונים שיוצגו |
| `.env.production` | הגדרות ייצור |
| `.github/workflows/deploy.yml` | GitHub Actions |
| `vite.config.js` | הגדרות בנייה |
| `DEPLOYMENT.md` | מדריך מפורט |

---

**גרסה:** 2.2.1  
**עודכן:** נובמבר 2025  
**זמן התקנה:** ~5 דקות


