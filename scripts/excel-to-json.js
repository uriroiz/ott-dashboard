#!/usr/bin/env node

/**
 * Excel to JSON Converter
 * 
 * This script converts an Excel file to JSON format for production deployment.
 * Usage: node scripts/excel-to-json.js <input.xlsx> [output.json]
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ Error: No input file specified');
  console.log('Usage: node scripts/excel-to-json.js <input.xlsx> [output.json]');
  console.log('Example: node scripts/excel-to-json.js data.xlsx public/data/ott-data.json');
  process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1] || resolve(__dirname, '../public/data/ott-data.json');

console.log('📊 Converting Excel to JSON...');
console.log(`   Input:  ${inputFile}`);
console.log(`   Output: ${outputFile}`);
console.log('');

// Dynamic import for XLSX (handles ES module compatibility)
async function convertExcelToJson() {
  try {
    // Import XLSX dynamically - get the default export
    const xlsxModule = await import('xlsx');
    const XLSX = xlsxModule.default || xlsxModule;
    
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

    // Write to JSON file
    writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf-8');

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
    console.error('💡 Tip: Make sure the Excel file exists and is not open in another program');
    process.exit(1);
  }
}

// Run the conversion
convertExcelToJson();
