import type { QuranApiResponse, UseQuranDataReturn, UseQuranNavigationReturn } from "~~/types"

export const useQuranNavigation = (quranData:UseQuranDataReturn):UseQuranNavigationReturn => {

  const selectedSurah = useCookie<number>('quran-surah', { 
    default: () => 1
  })
  
  const selectedAyah = useCookie<number>('quran-ayah', { 
    default: () => 1
  })
  
  const selectedJuz = useCookie<number>('quran-juz', { 
    default: () => 1
  })

  const pageInput = ref<number>(quranData.pageCounter.value)
  const updating = ref<boolean>(false)
  const ignorePageChange = ref<boolean>(false)

  const ayahList = computed(() => {
    const surah = quranData.surahMeta.value.find(s => s.number === selectedSurah.value)
    if (!surah) return []
    return Array.from({ length: surah.numberOfAyahs }, (_, i) => i + 1)
  })

  const juzNumber = computed(() => quranData.showPage.value?.ayahs?.[0]?.juz ?? '-')
  const surahPage = computed(() => quranData.showPage.value?.ayahs?.[0]?.surah?.name ?? '-')

  const ayahNumber = (index:number) => computed(() => 
    quranData.showPage.value?.ayahs?.[index]?.number ?? '-'
  )

  const updateJuzBasedOnSurahAyah = (surah:number, ayah:number):void => {
    if (!quranData.juzsMeta.value?.length) return
    
    for (let i = 0; i < quranData.juzsMeta.value.length; i++) {
      const currentJuz = quranData.juzsMeta.value[i]
      const nextJuz = quranData.juzsMeta.value[i + 1]
      
      if (!currentJuz) return

      const isInCurrentJuz = 
        surah > currentJuz.surah || 
        (surah === currentJuz.surah && ayah >= currentJuz.ayah)
      
      const isBeforeNextJuz = !nextJuz || 
        surah < nextJuz.surah || 
        (surah === nextJuz.surah && ayah < nextJuz.ayah)
      
      if (isInCurrentJuz && isBeforeNextJuz) {
        if (selectedJuz.value !== i + 1) {
          selectedJuz.value = i + 1
        }
        break
      }
    }
  }
  
  const applyPageChange = ():void => {
    if (pageInput.value >= 1 && pageInput.value <= 604) {
      updating.value = true
      quranData.pageCounter.value = pageInput.value
      updating.value = false
    } else {
      pageInput.value = quranData.pageCounter.value
    }
  }

  const nextPage = ():void => {
    if (quranData.pageCounter.value < 604) {
      quranData.pageCounter.value++
    }
  }

  const previousPage = () => {
    if (quranData.pageCounter.value > 1) {
      quranData.pageCounter.value--
    }
  }

  //for changings
  watch([selectedSurah, selectedAyah], async ([newSurah, newAyah], [oldSurah, oldAyah]) => {
    if (updating.value || !quranData.metaPage.value?.length) return
    
  //for changing surah and ayah (for search)
  if (newSurah !== oldSurah && newAyah !== oldAyah) {
    updating.value = true
    ignorePageChange.value = true
    
    let ayahPageIndex = quranData.metaPage.value.findIndex(
      (a) => a.surah === newSurah && a.ayah === newAyah
    )
    
    if (ayahPageIndex === -1) {
      try {
        const response = await $fetch<QuranApiResponse<{page:number}>>(
          `https://api.alquran.cloud/v1/ayah/${newSurah}:${newAyah}`
        )
        const ayahData = response?.data
        
        if (ayahData?.page) {
          quranData.pageCounter.value = ayahData.page
        }
      } catch (err) {
        console.error('Error fetching ayah:', err)
      }
    } else {
      quranData.pageCounter.value = ayahPageIndex + 1
    }
    
    updateJuzBasedOnSurahAyah(newSurah, newAyah)
    
    await nextTick()
    
    ignorePageChange.value = false
    updating.value = false
    return
  }
    
  //for changing surah
  if (newSurah !== oldSurah && newAyah === oldAyah) {
    let surahPageIndex = quranData.metaPage.value.findIndex(
      (p) => p.surah === newSurah && p.ayah === 1
    )

    if (surahPageIndex === -1) {
      const smaller = [...quranData.metaPage.value]
        .reverse()
        .find((p) => p.surah < newSurah)

      if (smaller) {
        surahPageIndex = quranData.metaPage.value.findIndex(
          (p) => p.surah === smaller.surah && p.ayah === smaller.ayah)
      }
    }

    if (surahPageIndex !== -1) {
      updating.value = true
      ignorePageChange.value = true
      selectedAyah.value = 1
      quranData.pageCounter.value = surahPageIndex + 1
      updateJuzBasedOnSurahAyah(newSurah, 1)
      await nextTick()
      await nextTick()
      ignorePageChange.value = false
      updating.value = false
    } else {
      updateJuzBasedOnSurahAyah(newSurah, selectedAyah.value)
    }
    return
  }
    
  //for changing ayah
  if (newSurah === oldSurah && newAyah !== oldAyah) {
    const ayahInCurrentPage = quranData.showPage.value?.ayahs?.find(
      a => a.surah.number === selectedSurah.value && a.numberInSurah === newAyah
    )
        
    if (ayahInCurrentPage) {
      updateJuzBasedOnSurahAyah(selectedSurah.value, newAyah)
      return
    }
        
    updating.value = true
    ignorePageChange.value = true
        
    let ayahPageIndex = quranData.metaPage.value.findIndex(
      (a) => a.surah === selectedSurah.value && a.ayah === newAyah
    )
        
    if (ayahPageIndex === -1) {
      const smaller = [...quranData.metaPage.value].reverse().find(
        (a) => a.surah === selectedSurah.value && a.ayah < newAyah
      ) 
          
      if (smaller) {
        ayahPageIndex = quranData.metaPage.value.findIndex(
          (a) => a.surah === selectedSurah.value && a.ayah === smaller.ayah
        )
      }
    }

    if (ayahPageIndex !== -1) {
      quranData.pageCounter.value = ayahPageIndex + 1
      updateJuzBasedOnSurahAyah(selectedSurah.value, newAyah)
      await nextTick()
      await nextTick()
      ignorePageChange.value = false
      updating.value = false
    } else {
      try {
        const response = await $fetch<QuranApiResponse<{page:number}>>(
          `https://api.alquran.cloud/v1/ayah/${selectedSurah.value}:${newAyah}`
        )
        const ayahData = response?.data
          
        if (ayahData && ayahData.page && ayahData.page !== quranData.pageCounter.value) {
          quranData.pageCounter.value = ayahData.page
        }
      } catch (err) {
        console.error('Error fetching ayah:', err)
      }
          
        updateJuzBasedOnSurahAyah(selectedSurah.value, newAyah)
        await nextTick()
        await nextTick()
        ignorePageChange.value = false
        updating.value = false
      }
    }
  }, { deep: false })

  //for changing page
  watch(() => quranData.pageCounter.value, async (newPage, oldPage) => {
    if (updating.value || ignorePageChange.value || !quranData.metaPage.value?.length) return
    
    const change = quranData.metaPage.value[newPage - 1]
    if (change) {
      updating.value = true
      selectedSurah.value = change.surah
      selectedAyah.value = change.ayah
      updateJuzBasedOnSurahAyah(change.surah, change.ayah)
      await nextTick()
      updating.value = false
    }
  })

  //for changing Juz
  watch(selectedJuz, async (newJuz, oldJuz) => {
    if (updating.value || !quranData.metaPage.value?.length) return
    
    const juzData = quranData.juzsMeta.value[newJuz - 1]
    
    if (juzData) {
      updating.value = true
      ignorePageChange.value = true
        
      selectedSurah.value = juzData.surah
      selectedAyah.value = juzData.ayah
        
      let juzPageIndex = quranData.metaPage.value.findIndex(
        (p) => p.surah === juzData.surah && p.ayah === juzData.ayah
      )
        
      if (juzPageIndex === -1) {
        const smaller = [...quranData.metaPage.value]
          .reverse()
          .find((p) => 
            (p.surah === juzData.surah && p.ayah < juzData.ayah) ||
            p.surah < juzData.surah
          )
          
        if (smaller) {
          juzPageIndex = quranData.metaPage.value.findIndex(
            (p) => p.surah === smaller.surah && p.ayah === smaller.ayah
          )
        }
      }
        
      if (juzPageIndex !== -1) {
        quranData.pageCounter.value = juzPageIndex + 1
      }
        
      await nextTick()
      await nextTick()
      ignorePageChange.value = false
      updating.value = false
    }
  })

  watch(() => quranData.pageCounter.value, (newPage) => {
    pageInput.value = newPage
  })
  
  //for Scroll smooth
  watch([selectedSurah, selectedAyah], async () => {
    await nextTick()
    
    setTimeout(() => {
      const highlighted = document.querySelector('[data-highlighted="true"]')
      if (highlighted) {
        highlighted.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        })
      }
    }, 500)
  })

  return {
    selectedSurah,
    selectedAyah,
    selectedJuz,
    pageInput,
    ayahList,
    juzNumber,
    surahPage,
    ayahNumber,
    applyPageChange,
    nextPage,
    previousPage,
    setUpdating: (value) => { updating.value = value },
    updating
  }
}
