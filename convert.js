// Simple Excel to JSON converter (CommonJS version)
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Get arguments
const inputFile = process.argv[2];
const outputFile = process.argv[3] || path.join(__dirname, 'public/data/ott-data.json');

if (!inputFile) {
  console.error('❌ Error: No input file specified');
  console.log('Usage: node convert.js <input.xlsx> [output.json]');
  process.exit(1);
}

console.log('📊 Converting Excel to JSON...');
console.log(`   Input:  ${inputFile}`);
console.log(`   Output: ${outputFile}`);
console.log('');

try {
  // Read Excel file
  const workbook = XLSX.readFile(inputFile, { cellDates: true });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData = XLSX.utils.sheet_to_json(firstSheet, { defval: null, raw: false });

  console.log(`✅ Parsed ${rawData.length} rows from Excel`);

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
  }

  // Write to JSON file
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf-8');

  console.log(`✅ Successfully converted to JSON!`);
  console.log(`📁 File saved: ${outputFile}`);
  console.log(`📊 Total rows: ${rawData.length}`);
  console.log('');
  console.log('🚀 Next steps:');
  console.log('   1. Review the JSON file');
  console.log('   2. Run: npm run build');
  console.log('   3. Deploy to GitHub Pages');

} catch (error) {
  console.error('❌ Error converting file:', error.message);
  console.error('');
  console.error('💡 Troubleshooting:');
  console.error('   - Make sure the Excel file exists');
  console.error('   - Close the file if it\'s open in Excel');
  console.error('   - Check the file path is correct');
  process.exit(1);
}


