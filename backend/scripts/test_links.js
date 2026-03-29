const xlsx = require('xlsx');
const path = require('path');
const workbook = xlsx.readFile(path.join(__dirname, '../../LC SHEET.xlsx'));
const sheetName = 'DSA Series Sheet';
const worksheet = workbook.Sheets[sheetName];

// Check a cell that should have a hyperlink, like E6 (row 6, 5th column -> 'E')
console.log("E6:", worksheet['E6']);
console.log("E6 link:", worksheet['E6'] ? worksheet['E6'].l : null);

console.log("E7:", worksheet['E7']);
console.log("E7 link:", worksheet['E7'] ? worksheet['E7'].l : null);

// Also video link, like G6
console.log("G6:", worksheet['G6']);
console.log("G6 link:", worksheet['G6'] ? worksheet['G6'].l : null);
