import Database from 'better-sqlite3'

export default defineEventHandler((event) => {
  // ========== 1. گرفتن پارامترها ==========
  const pageNumber = parseInt(event.context.params?.page || '1')
  const edition = event.context.params?.edition || 'quran-simple-clean'

  // ========== 2. باز کردن دیتابیس ==========
  const db = new Database('server/db/quran.db')

  // ========== 3. تشخیص جدول بر اساس edition ==========
  const tableName = edition === 'quran-simple-clean' ? 'quran_text' : 'fa_ghomshei'

  // ========== 4. پیدا کردن محدوده صفحه ==========
  // شروع این صفحه
  const pageStart = db.prepare(`
    SELECT start_sura, start_aya FROM pages WHERE page_number = ?
  `).get(pageNumber) as { start_sura: number; start_aya: number } | undefined

  // شروع صفحه بعدی (= پایان این صفحه)
  const pageEnd = db.prepare(`
    SELECT start_sura, start_aya FROM pages WHERE page_number = ?
  `).get(pageNumber + 1) as { start_sura: number; start_aya: number } | undefined

  if (!pageStart) {
    db.close()
    return { code: 404, status: 'Not Found', data: null }
  }

  // ========== 5. گرفتن اطلاعات همه سوره‌ها (برای استفاده بعدی) ==========
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

  // تبدیل به object برای دسترسی سریع
  const surahsMap: Record<number, any> = {}
  allSurahs.forEach(s => {
    surahsMap[s.number] = s
  })

  // ========== 6. گرفتن اطلاعات اجزاء ==========
  const allJuzs = db.prepare(`
    SELECT juz_number, start_sura, start_aya FROM juzs ORDER BY juz_number
  `).all() as Array<{ juz_number: number; start_sura: number; start_aya: number }>

  // ========== 7. گرفتن آیات این صفحه ==========
  let ayahsQuery = ''
  let ayahs: any[] = []

  if (pageEnd) {
    // اگه صفحه بعدی وجود داره
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
    // صفحه آخر
    ayahsQuery = `
      SELECT * FROM ${tableName}
      WHERE (sura > ? OR (sura = ? AND aya >= ?))
      ORDER BY id
    `
    ayahs = db.prepare(ayahsQuery).all(
      pageStart.start_sura, pageStart.start_sura, pageStart.start_aya
    )
  }

  // ========== 8. پردازش هر آیه و اضافه کردن اطلاعات ==========
  const processedAyahs = ayahs.map((ayah: any) => {
    const surahInfo = surahsMap[ayah.sura]
    
    // محاسبه شماره کلی آیه (1-6236)
    const globalNumber = surahInfo.start + ayah.aya

    // پیدا کردن جزء
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
      manzil: 1,  // ساده‌سازی شده
      page: pageNumber,
      ruku: 1,    // ساده‌سازی شده
      hizbQuarter: 1,  // ساده‌سازی شده
      sajda: false  // ساده‌سازی شده
    }
  })

  // ========== 9. ساختن object سوره‌های این صفحه ==========
  const surahsInPage: Record<string, any> = {}
  processedAyahs.forEach(ayah => {
    if (!surahsInPage[ayah.surah.number]) {
      surahsInPage[ayah.surah.number] = ayah.surah
    }
  })

  // ========== 10. اطلاعات edition ==========
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

  // ========== 11. خروجی نهایی ==========
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
