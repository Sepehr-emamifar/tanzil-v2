import Database from 'better-sqlite3'
import { readFileSync } from 'fs'

console.log('📥 Importing Quran Metadata...')

const db = new Database('server/db/quran.db')

db.exec(`DROP TABLE IF EXISTS surahs;`)
db.exec(`DROP TABLE IF EXISTS juzs;`)
db.exec(`DROP TABLE IF EXISTS pages;`)

db.exec(`
  CREATE TABLE surahs (
    number INTEGER PRIMARY KEY,
    start INTEGER,
    ayas INTEGER,
    order_num INTEGER,
    rukus INTEGER,
    name TEXT,
    tname TEXT,
    ename TEXT,
    type TEXT
  );
`)

db.exec(`
  CREATE TABLE juzs (
    juz_number INTEGER PRIMARY KEY,
    start_sura INTEGER,
    start_aya INTEGER
  );
`)

db.exec(`
  CREATE TABLE pages (
    page_number INTEGER PRIMARY KEY,
    start_sura INTEGER,
    start_aya INTEGER
  );
`)

console.log('✅ Tables created!')

const QuranData = JSON.parse(readFileSync('data/quran-metadata.json', 'utf-8'))

console.log('📊 Inserting Surahs...')
const insertSurah = db.prepare(`
  INSERT INTO surahs VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

for (let i = 1; i < QuranData.Sura.length - 1; i++) {
  const s = QuranData.Sura[i]
  insertSurah.run(i, s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7])
}

console.log('📊 Inserting Juzs...')
const insertJuz = db.prepare(`
  INSERT INTO juzs VALUES (?, ?, ?)
`)

for (let i = 1; i < QuranData.Juz.length; i++) {
  const j = QuranData.Juz[i]
  insertJuz.run(i, j[0], j[1])
}

console.log('📊 Inserting Pages...')
const insertPage = db.prepare(`
  INSERT INTO pages VALUES (?, ?, ?)
`)

for (let i = 1; i < QuranData.Page.length; i++) {
  const p = QuranData.Page[i]
  insertPage.run(i, p[0], p[1])
}

db.close()
console.log('🎉 Metadata imported successfully!')
