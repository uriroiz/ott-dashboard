// Simple Excel to JSON converter (CommonJS explicit)
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Get arguments
const inputFile = process.argv[2];
const outputFile = process.argv[3] || path.join(__dirname, 'public', 'data', 'ott-data.json');

if (!inputFile) {
  console.error('❌ שגיאה: לא צוין קובץ קלט');
  console.log('שימוש: node convert.cjs <input.xlsx> [output.json]');
  console.log('דוגמה: node convert.cjs basketball_data.xlsx public/data/ott-data.json');
  process.exit(1);
}

console.log('📊 ממיר Excel ל-JSON...');
console.log(`   קלט:  ${inputFile}`);
console.log(`   פלט: ${outputFile}`);
console.log('');

try {
  // Read Excel file
  const workbook = XLSX.readFile(inputFile, { cellDates: true });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData = XLSX.utils.sheet_to_json(firstSheet, { defval: null, raw: false });

  console.log(`✅ נקראו ${rawData.length} שורות מה-Excel`);

  // Create metadata
  const metadata = {
    generatedAt: new Date().toISOString(),
    totalRows: rawData.length,
    source: inputFile,
    version: '2.2.1'
  };

  // Create output object
  const output = {
    metadata,
    data: rawData
  };

  // Ensure directory exists
  const dir = path.dirname(outputFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ נוצרה תיקייה: ${dir}`);
  }

  // Write to JSON file
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf-8');

  console.log(`✅ ההמרה הצליחה!`);
  console.log(`📁 הקובץ נשמר: ${outputFile}`);
  console.log(`📊 סה"כ שורות: ${rawData.length}`);
  console.log('');
  console.log('🚀 שלבים הבאים:');
  console.log('   1. בדוק את קובץ ה-JSON');
  console.log('   2. הרץ: npm run build');
  console.log('   3. פרסם ל-GitHub Pages');
  console.log('');
  console.log('✨ מוכן לפריסה!');

} catch (error) {
  console.error('❌ שגיאה בהמרת הקובץ:', error.message);
  console.error('');
  console.error('💡 בדיקות:');
  console.error('   1. ודא שקובץ ה-Excel קיים');
  console.error('   2. סגור את הקובץ אם הוא פתוח ב-Excel');
  console.error('   3. בדוק שהנתיב נכון');
  console.error('');
  console.error('📍 נתיב נוכחי:', __dirname);
  console.error('📍 נתיב קלט:', path.resolve(inputFile));
  process.exit(1);
}


