// scripts/convertMetadataToJson.cjs
const fs = require('fs');

// خواندن فایل JS
const jsContent = fs.readFileSync('data/quran-data.js', 'utf-8');

// اجرای کد
eval(jsContent);

// ذخیره به JSON
fs.writeFileSync(
  'data/quran-metadata.json',
  JSON.stringify(QuranData, null, 2),
  'utf-8'
);

console.log('✅ JSON file created: data/quran-metadata.json');
