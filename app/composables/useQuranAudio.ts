import type { Ayah, UseQuranAudioReturn, UseQuranDataReturn, UseQuranNavigationReturn } from "~~/types"

export const useQuranAudio = (
  quranData:UseQuranDataReturn,
  navigation:UseQuranNavigationReturn,
  audioPlayerRef:ComputedRef<HTMLAudioElement | null>
  ):UseQuranAudioReturn => {
    
  const isAutoPlaying = ref<boolean>(false)
  const pendingPlayRequest = ref<{ surahNumber: number; ayahNumber: number } | null>(null)
  const isGoingToPreviousPage = ref<boolean | null>(false)


  const findAudioBySurahAndAyah = (surahNumber:number, ayahNumber:number):(string | null) => {
    if (!quranData.audio.value?.data?.ayahs) {
      return null
    }
    
    const ayahData = quranData.audio.value.data.ayahs.find(
      a => a.surah.number === surahNumber && a.numberInSurah === ayahNumber
    )
    
    const audioUrl = ayahData?.audio || ayahData?.audioSecondary?.[0] || null
    
    return audioUrl
  }

  const onAudioLoaded = async ():Promise<void> => {
    
    const player = unref(audioPlayerRef)
    if (pendingPlayRequest.value && player) {
      try {
        await player.play()
        pendingPlayRequest.value = null
      } catch (err) {
      }
    }
  }


  const playAyah = async (surahNumber: number, ayahNumber: number, autoPlay: boolean = true): Promise<void> => {
    const player = unref(audioPlayerRef)
    
    if (!player) {
      return
    }

    if (!player.paused) {
      player.pause()
    }
    player.currentTime = 0
    
    const src = findAudioBySurahAndAyah(surahNumber, ayahNumber)

    if (!src) {
      player.src = '' 
      pendingPlayRequest.value = null
      return
    }
    
    player.src = src
    player.load()

    if (autoPlay) {
      pendingPlayRequest.value = { surahNumber, ayahNumber }
      
      try {
        await player.play()
        pendingPlayRequest.value = null
      } catch (err) {}
    }
  }

  const handleAyahClick = async (ayah:Ayah):Promise<void> => {
    
    navigation.setUpdating(true)
    navigation.selectedSurah.value = ayah.surah.number
    navigation.selectedAyah.value = ayah.numberInSurah
    await nextTick()
    navigation.setUpdating(false)
    
    await playAyah(ayah.surah.number, ayah.numberInSurah, true)
  }

  const playNextAyah = async ():Promise<void> => {
    if (!quranData.showPage.value?.ayahs) return
    
    const currentIndex = quranData.showPage.value.ayahs.findIndex(
      a => a.surah.number === navigation.selectedSurah.value && 
           a.numberInSurah === navigation.selectedAyah.value
    )
    
    if (currentIndex === -1) return
    
    const totalAyahs = quranData.showPage.value.ayahs.length
    
    if (currentIndex < totalAyahs - 1) {
      const nextAyah = quranData.showPage.value.ayahs[currentIndex + 1]
      
      if (!nextAyah) return

      navigation.setUpdating(true)
      navigation.selectedSurah.value = nextAyah.surah.number
      navigation.selectedAyah.value = nextAyah.numberInSurah
      await nextTick()
      navigation.setUpdating(false)
      
      await playAyah(nextAyah.surah.number, nextAyah.numberInSurah, true)
    } else {
      if (quranData.pageCounter.value < 604) {
        isAutoPlaying.value = true
        quranData.pageCounter.value++
      }
    }
  }

  // Watch for audio changes
  watch(
    [() => quranData.audio.value, () => navigation.selectedSurah.value, () => navigation.selectedAyah.value], 
  async ([newAudio, newSurah, newAyah], [oldAudio, oldSurah, oldAyah]) => {
    const player = unref(audioPlayerRef)
    if (!newAudio?.data?.ayahs?.length || !player) return
    
    const src = findAudioBySurahAndAyah(newSurah, newAyah)
    
    if (src && player.src !== src) {
      const shouldAutoPlay = isAutoPlaying.value || pendingPlayRequest.value !== null
      await playAyah(newSurah, newAyah, shouldAutoPlay)
      
      if (isAutoPlaying.value && quranData.showPage.value?.ayahs?.length) {
        const pageChanged = oldAudio?.data?.ayahs?.[0]?.page !== newAudio?.data?.ayahs?.[0]?.page
        
        if (pageChanged && isGoingToPreviousPage.value) {
          const lastAyah = quranData.showPage.value.ayahs[quranData.showPage.value.ayahs.length - 1]

          if (!lastAyah) return

          navigation.setUpdating(true)
          navigation.selectedSurah.value = lastAyah.surah.number
          navigation.selectedAyah.value = lastAyah.numberInSurah
          await nextTick()
          navigation.setUpdating(false)
          
          await playAyah(lastAyah.surah.number, lastAyah.numberInSurah, true)
        }
        
          isAutoPlaying.value = false
          isGoingToPreviousPage.value = false
        }
      }
    }, 
    { immediate: true }
  )



  // Initial load
  onMounted(() => {
    const player = unref(audioPlayerRef)
    if (player && quranData.audio.value?.data?.ayahs?.length) {
      const src = findAudioBySurahAndAyah(
        navigation.selectedSurah.value, 
        navigation.selectedAyah.value
      )
      if (src) {
        player.src = src
        player.load()
      }
    }
  })

  const playPreviousAyah = async () => {
    if (!quranData.showPage.value?.ayahs) return
    
    const currentIndex = quranData.showPage.value.ayahs.findIndex(
      a => a.surah.number === navigation.selectedSurah.value && 
           a.numberInSurah === navigation.selectedAyah.value
    )
    
    if (currentIndex === -1) return
    
    if (currentIndex > 0) {
      const prevAyah = quranData.showPage.value.ayahs[currentIndex - 1]
      
      if (!prevAyah) return
      
      navigation.setUpdating(true)
      navigation.selectedSurah.value = prevAyah.surah.number
      navigation.selectedAyah.value = prevAyah.numberInSurah
      await nextTick()
      navigation.setUpdating(false)
      
      await playAyah(prevAyah.surah.number, prevAyah.numberInSurah, true)
   } else {
      if (quranData.pageCounter.value > 1) {
        const player = unref(audioPlayerRef)
        if (player && !player.paused) {
          player.pause()
        }
        
        isAutoPlaying.value = true
        isGoingToPreviousPage.value = true
        quranData.pageCounter.value--
      }
    }
  }


  return {
    handleAyahClick,
    playNextAyah,
    playPreviousAyah,
    onAudioLoaded
  }
}