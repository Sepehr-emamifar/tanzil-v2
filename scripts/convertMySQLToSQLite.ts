import { readFileSync, writeFileSync } from 'fs'

console.log('🔄 Converting MySQL to SQLite...')

const mysqlQuran = readFileSync('data/quran-simple-clean.sql', 'utf-8')
const mysqlTrans = readFileSync('data/fa.ghomshei.sql', 'utf-8')

function convert(sql: string): string {
  return sql

    .replace(/CREATE DATABASE[\s\S]*?;/gi, '')
    .replace(/USE\s+`?\w+`?;?/gi, '')

    .replace(/^#.*$/gmi, '')

    .replace(/`/g, '')

    .replace(/ENGINE=\w+\s*/gi, '')
    .replace(/AUTO_INCREMENT=\d+\s*/gi, '')
    .replace(/AUTO_INCREMENT/gi, '')
    .replace(/CHARACTER SET\s*\w+/gi, '')
    .replace(/COLLATE\s*\w+/gi, '')

    .replace(/int\(\d+\)/gi, 'INTEGER')

    .replace(/DEFAULT\s*'0'/gi, 'DEFAULT 0')

    .replace(/\bindex\b/gi, 'id')

    .replace(/\)\s*DEFAULT\s*[^;]*;/gi, ');')

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
