# 🚀 התחלה מהירה

## צעדים ראשונים

### 1. התקנה (פעם אחת)

**אופציה א' - התקנה אוטומטית (Windows):**
```bash
לחץ פעמיים על הקובץ: setup.bat
```

**אופציה ב' - התקנה ידנית:**
```bash
cd ott-dashboard
npm install
```

### 2. הפעלה

**אופציה א' - הפעלה מהירה (Windows):**
```bash
לחץ פעמיים על הקובץ: start.bat
```

**אופציה ב' - הפעלה ידנית:**
```bash
npm run dev
```

הדשבורד ייפתח אוטומטית בכתובת: `http://localhost:3000`

### 3. שימוש

1. **העלה קובץ Excel** - לחץ על "בחר קובץ" והעלה את קובץ הנתונים החודשי
2. **צפה בתוצאות** - הדשבורד יציג אוטומטית:
   - 3 תרשימים אינטראקטיביים
   - 4 טבלאות סיכום מפורטות
   - סטטיסטיקות מצטברות

## דוגמת מבנה קובץ Excel

| eventname | Event Date | HomeTeam | AwayTeam | Views | unique users | Playtime Hours | Production Hours |
|-----------|------------|----------|----------|-------|--------------|----------------|------------------|
| ליגת אתנה ווינר - מכבי נגד הפועל | 2025-10-15 | מכבי תל אביב | הפועל ירושלים | 15000 | 8500 | 250.5 | 3.5 |

## בעיות נפוצות

### "לא נמצאו נתונים תקינים"

**פתרון:**
- ודא ששמות העמודות באנגלית בדיוק כמו בטבלה למעלה
- בדוק שעמודת `eventname` מכילה את שם הליגה (לדוגמה: "ליגת אתנה ווינר")

### "השרת לא עולה"

**פתרון:**
```bash
# סגור את הטרמינל והפעל מחדש
npm run dev
```

### "npm לא מזוהה"

**פתרון:**
- התקן Node.js מ: https://nodejs.org/
- הפעל מחדש את המחשב
- נסה שוב

## קיצורי דרך

- `Ctrl + C` - עצור את השרת
- `npm run build` - בנה גרסת ייצור
- `npm run preview` - צפה בגרסת ייצור

## תמיכה

לעזרה נוספת ראה את הקובץ `README.md` המלא.

---

**טיפ:** שמור את הקובץ `setup.bat` ו-`start.bat` בשולחן העבודה להפעלה מהירה! 🎯

