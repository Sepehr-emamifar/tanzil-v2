import Database from 'better-sqlite3'

export default defineEventHandler(() => {
  const db = new Database('server/db/quran.db')

  const surahs = db.prepare(`
    SELECT number, name, tname as englishName, ename as englishNameTranslation, 
           ayas as numberOfAyahs, type as revelationType
    FROM surahs
    ORDER BY number
  `).all()

  const pages = db.prepare(`
    SELECT start_sura as surah, start_aya as ayah
    FROM pages
    ORDER BY page_number
  `).all()

  const juzs = db.prepare(`
    SELECT start_sura as surah, start_aya as ayah
    FROM juzs
    ORDER BY juz_number
  `).all()

  db.close()

  return {
    code: 200,
    status: 'OK',
    data: {
      ayahs: {
        count: 6236
      },
      surahs: {
        count: 114,
        references: surahs
      },
      pages: {
        count: 604,
        references: pages
      },
      juzs: {
        count: 30,
        references: juzs
      }
    }
  }
})
