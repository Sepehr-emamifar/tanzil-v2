import Database from 'better-sqlite3'

export default defineEventHandler((event) => {
  const pageNumber = parseInt(event.context.params?.page || '1')
  const edition = event.context.params?.edition || 'quran-simple-clean'

  const db = new Database('server/db/quran.db')

  const tableName = edition === 'quran-simple-clean' ? 'quran_text' : 'fa_ghomshei'

  const pageStart = db.prepare(`
    SELECT start_sura, start_aya FROM pages WHERE page_number = ?
  `).get(pageNumber) as { start_sura: number; start_aya: number } | undefined

  const pageEnd = db.prepare(`
    SELECT start_sura, start_aya FROM pages WHERE page_number = ?
  `).get(pageNumber + 1) as { start_sura: number; start_aya: number } | undefined

  if (!pageStart) {
    db.close()
    return { code: 404, status: 'Not Found', data: null }
  }

  const allSurahs = db.prepare(`
    SELECT number, name, tname, ename, type, ayas, start
    FROM surahs
  `).all() as Array<{
    number: number
    name: string
    tname: string
    ename: string
    type: string
    ayas: number
    start: number
  }>

  const surahsMap: Record<number, any> = {}
  allSurahs.forEach(s => {
    surahsMap[s.number] = s
  })

  const allJuzs = db.prepare(`
    SELECT juz_number, start_sura, start_aya FROM juzs ORDER BY juz_number
  `).all() as Array<{ juz_number: number; start_sura: number; start_aya: number }>

  let ayahsQuery = ''
  let ayahs: any[] = []

  if (pageEnd) {
    ayahsQuery = `
      SELECT * FROM ${tableName}
      WHERE (sura > ? OR (sura = ? AND aya >= ?))
        AND (sura < ? OR (sura = ? AND aya < ?))
      ORDER BY id
    `
    ayahs = db.prepare(ayahsQuery).all(
      pageStart.start_sura, pageStart.start_sura, pageStart.start_aya,
      pageEnd.start_sura, pageEnd.start_sura, pageEnd.start_aya
    )
  } else {
    ayahsQuery = `
      SELECT * FROM ${tableName}
      WHERE (sura > ? OR (sura = ? AND aya >= ?))
      ORDER BY id
    `
    ayahs = db.prepare(ayahsQuery).all(
      pageStart.start_sura, pageStart.start_sura, pageStart.start_aya
    )
  }

  const processedAyahs = ayahs.map((ayah: any) => {
    const surahInfo = surahsMap[ayah.sura]
    
    const globalNumber = surahInfo.start + ayah.aya

    let juzNumber = 1
    for (let i = allJuzs.length - 1; i >= 0; i--) {
      const juz = allJuzs[i]
      if (
        ayah.sura > juz.start_sura ||
        (ayah.sura === juz.start_sura && ayah.aya >= juz.start_aya)
      ) {
        juzNumber = juz.juz_number
        break
      }
    }

    return {
      number: globalNumber,
      text: ayah.text,
      surah: {
        number: surahInfo.number,
        name: surahInfo.name,
        englishName: surahInfo.tname,
        englishNameTranslation: surahInfo.ename,
        revelationType: surahInfo.type,
        numberOfAyahs: surahInfo.ayas
      },
      numberInSurah: ayah.aya,
      juz: juzNumber,
      manzil: 1,  
      page: pageNumber,
      ruku: 1,    
      hizbQuarter: 1,  
      sajda: false  
    }
  })

  const surahsInPage: Record<string, any> = {}
  processedAyahs.forEach(ayah => {
    if (!surahsInPage[ayah.surah.number]) {
      surahsInPage[ayah.surah.number] = ayah.surah
    }
  })

  const editionInfo = edition === 'quran-simple-clean' ? {
    identifier: 'quran-simple-clean',
    language: 'ar',
    name: 'القرآن الكريم المبسط (بدون تشكيل) (simple-clean)',
    englishName: 'Simple Clean',
    format: 'text',
    type: 'quran',
    direction: 'rtl'
  } : {
    identifier: 'fa.ghomshei',
    language: 'fa',
    name: 'الهی قمشه‌ای',
    englishName: 'Mahdi Elahi Ghomshei',
    format: 'text',
    type: 'translation',
    direction: 'rtl'
  }

  db.close()

  return {
    code: 200,
    status: 'OK',
    data: {
      number: pageNumber,
      ayahs: processedAyahs,
      surahs: surahsInPage,
      edition: editionInfo
    }
  }
})
