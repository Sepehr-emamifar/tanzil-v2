import type { UseQuranTextSettingsReturn } from "~~/types"

export const useTextSettings = ():UseQuranTextSettingsReturn => {

  const selectedFont = useCookie<string>('quran-font', { 
    default: () => 'Scheherazade New' 
  })
  
  const fontSize = useCookie<number>('quran-fontSize', { 
    default: () => 100
  })
  
  const translationFont = 'B Koodak'

  const fontOptions = [
    { label: 'Scheherazade', value: 'Scheherazade New' },
    { label: 'KFGQPC Hafs', value: 'KFGQPC Hafs' },
    { label: 'KFGQPC Uthmanic', value: 'KFGQPC Uthmanic' },
    { label: 'Me Quran', value: 'Me Quran' },
    { label: 'PDMS Saleem', value: 'PDMS Saleem' },
    { label: 'Traditional Arabic', value: 'Traditional Arabic' }
  ]

  // Computed styles
  const contentStyle = computed(() => ({
    fontFamily: `"${selectedFont.value}"`,
    fontSize: `${Number(fontSize.value) * 1.4}%`,
    lineHeight: '2.5'
  }))

  const translationStyle = computed(() => ({
    fontFamily: '"B Koodak", Tahoma, sans-serif', 
    fontSize: `${Number(fontSize.value) * 1.2}%`,
    lineHeight: '2'
  }))

  // Actions
  const increaseFontSize = ():void => {
    const current = Number(fontSize.value)
    if (current < 200) {
      fontSize.value = current + 5
    }
  }

  const decreaseFontSize = ():void => {
    const current = Number(fontSize.value)
    if (current > 75) {
      fontSize.value = current - 5
    }
  }

  const resetFontSize = ():void => {
    fontSize.value = 100
    selectedFont.value = 'Scheherazade New'
  }

  return {
    selectedFont,
    fontSize,
    fontOptions,
    contentStyle,
    translationStyle,
    translationFont,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize
  }
}