import type { Edition, QuranApiResponse, QuranMetaData, QuranPageData, UseQuranDataReturn } from "~~/types"

export const useQuranData = ():UseQuranDataReturn => {
  
  const selectedEdition = useCookie<string>('quran-edition', { 
    default: () => 'quran-uthmani'
  })
  
  const selectedTranslator = useCookie<string>('quran-translator', { 
    default: () => 'fa.ghomshei'
  })
  
  const selectedQari = useCookie<string>('quran-qari', { 
    default: () => 'ar.alafasy'
  })
  
  const pageCounter = useCookie<number>('quran-page', { 
    default: () => 1
  })

  const { data: meta, status: metaStatus } = useFetch<QuranApiResponse<QuranMetaData>>(
    '/api/meta'
  )

  const { data: quran, status: quranStatus } = useFetch<QuranApiResponse<Edition[]>>(
    'https://api.alquran.cloud/v1/edition'
  )

  const { data: page, status: pageStatus, error: pageError, refresh: refreshPage } = useFetch<QuranApiResponse<QuranPageData>>(() => 
    `/api/page/${pageCounter.value}/quran-simple-clean`
  )

  const { data: tarjomeh, status: tarjomehStatus, error: tarjomehError, refresh: refreshTarjomeh } = useFetch<QuranApiResponse<QuranPageData>>(() => 
    `/api/page/${pageCounter.value}/fa.ghomshei`
  )

  const { data: audio, status: audioStatus, error: audioError, refresh: refreshAudio } = useFetch<QuranApiResponse<QuranPageData>>(() => 
    `https://api.alquran.cloud/v1/page/${pageCounter.value}/${selectedQari.value}`
  )

  const network = inject('network' ,{isOnline:ref(true)})

  const hasError = computed(()=> {
    const isOfflineAndLoading =
     !network.isOnline.value && (pageStatus.value === 'pending' || tarjomehStatus.value === 'pending')

    const hasApiError = pageError.value || tarjomehError.value || audioError.value

    return hasApiError || isOfflineAndLoading
  })

  const isLoading = computed(() => 
    (pageStatus.value === 'pending' || 
    tarjomehStatus.value === 'pending'||
    audioStatus.value === 'pending') &&
    !hasError.value
  )


  const refreshAll = async() => {
      await Promise.all([
      refreshPage(),
      refreshTarjomeh(),
      refreshAudio()
    ])
  }

  const showPage = computed(() => page.value?.data ?? {})
  const metaPage = computed(() => meta.value?.data?.pages?.references ?? [])
  const surahMeta = computed(() => meta.value?.data?.surahs?.references ?? [])
  const juzsMeta = computed(() => meta.value?.data?.juzs?.references ?? [])

  const qari = computed(() =>
    quran.value?.data?.filter(item => item.format === 'audio') ?? []
  )

  const translator = computed(() =>
    quran.value?.data?.filter(
      item => item.type === 'translation' && 
              item.format === 'text' && 
              item.language !== 'ba'
    ) ?? []
  )

  const edition = computed(() =>
    quran.value?.data?.filter(item => item.type === 'quran') ?? []
  )

  return {
    selectedEdition,
    selectedTranslator,
    selectedQari,
    pageCounter,

    hasError,
    isLoading,
    refreshAll,
    pageError,
    tarjomehError,
    audioError,
    
    showPage,
    metaPage,
    surahMeta,
    juzsMeta,
    tarjomeh,
    audio,
    
    qari,
    translator,
    edition
  }
}