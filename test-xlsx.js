// Test XLSX import
console.log('Testing XLSX import...\n');

async function test() {
  try {
    // Test 1: Dynamic import
    console.log('Test 1: Dynamic import');
    const xlsxModule = await import('xlsx');
    console.log('✅ Import successful');
    console.log('Module keys:', Object.keys(xlsxModule));
    
    // Test 2: Check for readFile
    const XLSX = xlsxModule.default || xlsxModule;
    console.log('Has readFile?', typeof XLSX.readFile);
    console.log('Has utils?', typeof XLSX.utils);
    
    if (typeof XLSX.readFile === 'function') {
      console.log('✅ XLSX.readFile is available!');
    } else {
      console.log('❌ XLSX.readFile is NOT available');
      console.log('Available methods:', Object.keys(XLSX).slice(0, 10));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();

