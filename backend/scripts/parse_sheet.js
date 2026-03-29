const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const workbook = xlsx.readFile(path.join(__dirname, '../../LC SHEET.xlsx'));
const sheetName = 'DSA Series Sheet';
const worksheet = workbook.Sheets[sheetName];
const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

const problems = [];
let currentCategory = "General";

let startIdx = 0;
for (let i = 0; i < Math.min(20, rows.length); i++) {
  if (rows[i] && rows[i][3] === 'Question' && rows[i][4] === 'Link') {
    startIdx = i + 1;
    break;
  }
}

for (let i = startIdx; i < rows.length; i++) {
  const row = rows[i];
  if (!row || row.length === 0) continue;

  if (row[0] && typeof row[0] === 'string' && row[0].trim().length > 0) {
    currentCategory = row[0].trim().toUpperCase();
  }

  const questionNum = row[2];
  const questionName = row[3];

  // Excel stores hyperlnks in a separate property `.l` on the cell object
  // Calculate raw row index in the worksheet
  const r = i;
  
  let linkUrl = '';
  let videoUrl = '';
  
  const linkCell = worksheet[xlsx.utils.encode_cell({c: 4, r: r})];
  if (linkCell && linkCell.l && linkCell.l.Target) {
    linkUrl = linkCell.l.Target;
  } else if (row[4] && typeof row[4] === 'string' && row[4].startsWith('http')) {
    linkUrl = row[4];
  }

  const videoCell = worksheet[xlsx.utils.encode_cell({c: 6, r: r})];
  if (videoCell && videoCell.l && videoCell.l.Target) {
    videoUrl = videoCell.l.Target;
  } else if (row[6] && typeof row[6] === 'string' && row[6].startsWith('http')) {
    videoUrl = row[6];
  }

  const difficulty = (row[5] || 'Medium').trim();
  const companies = row[7] ? (typeof row[7] === 'string' ? row[7].split(' ') : []) : [];
  const preReq = row[8] || null;

  // We only add valid problems that have at least a Name and either a link or just a name.
  // Wait, the user said links aren't working, but some might only have question name.
  if (questionName) {
    problems.push({
      id: `q${questionNum || i}`, // unique ID
      category: currentCategory,
      title: questionName.trim(),
      link: linkUrl || '#',
      difficulty: difficulty,
      video: videoUrl || null,
      companies: companies,
      prerequisites: preReq || null
    });
  }
}

const frontendDataDir = path.join(__dirname, '../../frontend/data');
if (!fs.existsSync(frontendDataDir)) {
  fs.mkdirSync(frontendDataDir, { recursive: true });
}

fs.writeFileSync(path.join(frontendDataDir, 'problems.json'), JSON.stringify(problems, null, 2));
console.log(`Successfully parsed ${problems.length} problems!`);
