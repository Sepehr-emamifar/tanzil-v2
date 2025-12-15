const fs = require('fs');

const jsContent = fs.readFileSync('data/quran-data.js', 'utf-8');

eval(jsContent);

fs.writeFileSync(
  'data/quran-metadata.json',
  JSON.stringify(QuranData, null, 2),
  'utf-8'
);

console.log('✅ JSON file created: data/quran-metadata.json');
