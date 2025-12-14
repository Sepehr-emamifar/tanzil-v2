// scripts/convertMySQLToSQLite.ts
import { readFileSync, writeFileSync } from 'fs'

console.log('🔄 Converting MySQL to SQLite...')

const mysqlQuran = readFileSync('data/quran-simple-clean.sql', 'utf-8')
const mysqlTrans = readFileSync('data/fa.ghomshei.sql', 'utf-8')

function convert(sql: string): string {
  return sql

    // حذف ساخت دیتابیس و USE
    .replace(/CREATE DATABASE[\s\S]*?;/gi, '')
    .replace(/USE\s+`?\w+`?;?/gi, '')

    // حذف کامنت‌های #
    .replace(/^#.*$/gmi, '')

    // حذف بک‌تیک
    .replace(/`/g, '')

    // حذف ENGINE, CHARSET, COLLATE
    .replace(/ENGINE=\w+\s*/gi, '')
    .replace(/AUTO_INCREMENT=\d+\s*/gi, '')
    .replace(/AUTO_INCREMENT/gi, '')
    .replace(/CHARACTER SET\s*\w+/gi, '')
    .replace(/COLLATE\s*\w+/gi, '')

    // تبدیل int → INTEGER
    .replace(/int\(\d+\)/gi, 'INTEGER')

    // اصلاح default
    .replace(/DEFAULT\s*'0'/gi, 'DEFAULT 0')

    // تبدیل ستون index → id
    .replace(/\bindex\b/gi, 'id')

    // حذف DEFAULT table options (مشکل اصلی)
    .replace(/\)\s*DEFAULT\s*[^;]*;/gi, ');')

    // تمیزکاری اضافی
    .replace(/,\s*\)/g, ')')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

const out = `
-- SQLite Quran DB

${convert(mysqlQuran)}

${convert(mysqlTrans)}
`

writeFileSync('data/quran-sqlite.sql', out, 'utf-8')

console.log('✅ SQLite SQL generated successfully!')
