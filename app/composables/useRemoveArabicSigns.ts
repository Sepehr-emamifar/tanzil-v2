import type { Ayah } from "~~/types/index"

interface UseRemoveArabicSignsReturn {
  removeArabicDiacritics: (text: string) => string
  removeBismillah: (ayah: Ayah) => string
  convertToArabicNumber: (num: number) => string
}

export const useRemoveArabicSigns = ():UseRemoveArabicSignsReturn =>{
    const removeArabicDiacritics = (text:string):string => {
      if (!text) return ''
      return text
        .replace(/سُورَةُ\s*/g, '')
        .replace(/[\u064B-\u065F\u0670]/g, '')
        .replace(/ٱ/g, 'ا')
        .replace(/صۡ/g,'ص')
        .replace(/خۡ/g,'خ')
        .replace(/يۡ/g,'ی')
        .replace(/وۡ/g,'و')
        .replace(/لۡ/g,'ل')
        .replace(/دۡ/g,'د')
        .replace(/رۡۡ/g,'ر')
        .replace(/رۡ/g,'ر')
        .replace(/مۡ/g,'م')
        .replace(/جۡ/g,'ج')
        .replace(/عۡ/g,'ع')
        .replace(/سۡ/g,'س')
        .replace(/هۡ/g,'ه')
        .replace(/ؤۡ/g,'و')
        .replace(/قۡ/g,'ق')
        .replace(/حۡ/g,'ح')
        .replace(/تۡ/g,'ت')
        .trim()
    }
    const removeBismillah = (ayah:Ayah):string => {
      if (!ayah?.text) return ''
        
      if (ayah.numberInSurah !== 1) {
        return ayah.text
      }

      if (ayah.surah.number === 1 || ayah.surah.number === 9) {
        return ayah.text
      }

      let text = ayah.text.trim()

      if (text.startsWith('بِسْمِ') || text.startsWith('بِسۡمِ') || text.startsWith('بسم') || text.startsWith('بِسمِ') || text.startsWith('بِّسْمِ')) {
        const words = text.split(' ')
        if (words.length > 4) {
          return words.slice(4).join(' ').trim()
        }
      }

      return text
    } 
    const convertToArabicNumber = (num: number): string => {
      const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
      return String(num)
      .split('')
      .map(digit => {
        const index = parseInt(digit)
        return isNaN(index) ? digit : arabicNumbers[index]
      })
      .join('')
    }
    return{
        removeArabicDiacritics,
        removeBismillah,
        convertToArabicNumber
    }
}
