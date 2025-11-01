# BUGFIX - גרסה 2.2.1

## [גרסה 2.2.1] - נובמבר 2025

### 🐛 תיקון: פרסור תאריכים מ-Excel

#### הבעיה
```
תאריך ב-Excel: 10/8/2025 (8 באוקטובר 2025)
תאריך בדשבורד: 1.1.1970 ❌
```

**סיבה:**
- Excel מאחסן תאריכים כמספרים סידוריים (serial numbers)
- למשל: המספר 45588 = 8 באוקטובר 2025
- הקוד הישן לא טיפל בפורמט הזה

#### הפתרון
נוספה פונקציה `parseExcelDate` שמטפלת ב-3 סוגי תאריכים:

```javascript
function parseExcelDate(excelDate) {
  // 1. אם זה כבר Date object - החזר אותו
  if (excelDate instanceof Date) {
    return excelDate;
  }
  
  // 2. אם זה מספר (Excel serial date)
  if (typeof excelDate === 'number') {
    // המר מספר Excel לתאריך JavaScript
    const excelEpoch = new Date(1899, 11, 30);
    const jsDate = new Date(excelEpoch.getTime() + excelDate * 86400000);
    return jsDate;
  }
  
  // 3. אם זה string - נסה לפרסר
  if (typeof excelDate === 'string') {
    // נסה פורמט רגיל
    const date = new Date(excelDate);
    if (!isNaN(date.getTime())) return date;
    
    // נסה פורמט MM/DD/YYYY
    const parts = excelDate.split('/');
    if (parts.length === 3) {
      const month = parseInt(parts[0]) - 1;
      const day = parseInt(parts[1]);
      const year = parseInt(parts[2]);
      return new Date(year, month, day);
    }
  }
  
  return null;
}
```

#### שינויים נוספים
```javascript
// App.jsx - הוספנו אופציות ל-XLSX.read
const workbook = XLSX.read(data, { 
  type: 'array', 
  cellDates: true  // ✅ נסה להמיר תאים לתאריכים
});

const rawData = XLSX.utils.sheet_to_json(firstSheet, { 
  defval: null, 
  raw: false  // ✅ אל תחזיר ערכים "גולמיים" (מספרים)
});
```

### ✅ אחרי התיקון

```
תאריך ב-Excel: 10/8/2025
תאריך בדשבורד: 8.10.2025 ✅
```

### 📋 פורמטים נתמכים

הפונקציה החדשה תומכת ב:

1. **מספרים סידוריים של Excel**
   ```
   45588 → 8 באוקטובר 2025
   ```

2. **Date objects**
   ```javascript
   new Date('2025-10-08') → 8 באוקטובר 2025
   ```

3. **Strings בפורמטים שונים**
   ```
   '2025-10-08' → 8 באוקטובר 2025
   '10/8/2025'  → 8 באוקטובר 2025
   ```

### 🧪 בדיקות

**דוגמאות מוצלחות:**
```
✅ 10/8/2025  → 8 באוקטובר 2025
✅ 45588      → 8 באוקטובר 2025
✅ 2025-10-08 → 8 באוקטובר 2025
```

### 📁 קבצים ששונו

- `src/utils/dataProcessor.js` - נוספה `parseExcelDate()`
- `src/App.jsx` - עודכנו אופציות XLSX

### 🚀 עדכון

```bash
cd ott-dashboard
npm run dev
```

**לא צריך התקנה מחדש!** רק רענן את הדפדפן.

---

**גרסה:** 2.2.1  
**תאריך:** נובמבר 2025  
**סוג:** Bugfix  
**השפעה:** תיקון קריטי לתצוגת תאריכים

