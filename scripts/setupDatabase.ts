// scripts/setupDatabase.ts:
import Database from 'better-sqlite3'
import { readFileSync, existsSync, unlinkSync } from 'fs'

console.log('🚀 Setting up SQLite database...')

const dbPath = 'server/db/quran.db'

if (existsSync(dbPath)) {
  console.log('🗑 Removing previous database...')
  unlinkSync(dbPath)
}

const db = new Database(dbPath)

console.log('📖 Loading SQL...')
const sql = readFileSync('data/quran-sqlite.sql', 'utf8')

console.log('⚙️ Executing SQL...')
try {
  db.exec(sql)
  console.log('✅ SQL execution completed!')
} catch (e: any) {
  console.error('❌ SQL ERROR:', e.message ?? e)
}

console.log('🔍 Counting records...')
try {
  // روش امن با cast + چِک
  const qRow = db.prepare('SELECT COUNT(*) AS n FROM quran_text').get() as { n: number } | undefined
  const tRow = db.prepare('SELECT COUNT(*) AS n FROM fa_ghomshei').get() as { n: number } | undefined

  const qCount = qRow?.n ?? 0
  const tCount = tRow?.n ?? 0

  // اولی ممکنه undefined باشه، پس چک می‌کنیم
  let first: { id: number; sura: number; aya: number; text: string } | undefined
  try {
    first = db.prepare('SELECT * FROM quran_text LIMIT 1').get() as
      | { id: number; sura: number; aya: number; text: string }
      | undefined
  } catch (e) {
    first = undefined
  }

  console.log('📊 Quran ayahs:', qCount)
  console.log('📊 Translated ayahs:', tCount)
  console.log('🎯 First ayah:', first)
} catch (e: any) {
  console.error('❌ CHECK ERROR:', e.message ?? e)
}

db.close()
console.log('🎉 Done!')
