import type { Ref, ComputedRef } from 'vue'
import type { FetchError } from 'ofetch'


// ============ API Response Types ============

// Generic API Response wrapper
export interface QuranApiResponse<T = any> {
  code: number
  status: string
  data: T
}

// Meta API Response (/v1/meta)
export interface QuranMetaData {
  ayahs: {
    count: number
  }
  surahs: {
    count: number
    references: SurahReference[]
  }
  pages: {
    count: number
    references: PageReference[]
  }
  juzs: {
    count: number
    references: JuzReference[]
  }
}

export interface SurahReference {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: 'Meccan' | 'Medinan'
}

export interface PageReference {
  surah: number
  ayah: number
}

export interface JuzReference {
  surah: number
  ayah: number
}

// Edition API Response (/v1/edition)
export type QuranEditionData = Edition[]

export interface Edition {
  identifier: string
  language: string
  name: string
  englishName: string
  format: 'text' | 'audio'
  type: 'quran' | 'translation' | 'tafsir' | 'versebyverse'
  direction?: string | null
}

// Page API Response (/v1/page/{pageNumber}/{edition})
export interface QuranPageData {
  number: number
  ayahs: Ayah[]
  surahs: Record<string, SurahInPage>
  edition: Edition
}

export interface Ayah {
  number: number
  text: string
  numberInSurah: number
  juz: number
  manzil?: number
  page: number
  ruku?: number
  hizbQuarter?: number
  sajda?: boolean | SajdaInfo
  surah: Surah
  audio?: string
  audioSecondary?: string[]
}

export interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: 'Meccan' | 'Medinan'
}

export interface SurahInPage {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  revelationType: 'Meccan' | 'Medinan'
  numberOfAyahs: number
}

export interface SajdaInfo {
  id: number
  recommended: boolean
  obligatory: boolean
}

// ============ Metadata Types ============

export interface SurahMeta {
  number: number
  name: string
  numberOfAyahs: number
}

export interface JuzMeta {
  surah: number
  ayah: number
}

// ============ Composable Return Types ============

export interface UseQuranDataReturn {
  selectedEdition: Ref<string>
  selectedTranslator: Ref<string>
  selectedQari: Ref<string>
  pageCounter: Ref<number>
  
  hasError: ComputedRef<boolean | FetchError<any>>
  isLoading: ComputedRef<boolean>
  refreshAll: () => Promise<void>
  
  pageError: Ref<FetchError | undefined>
  tarjomehError: Ref<FetchError | undefined>
  audioError: Ref<FetchError | undefined>
  
  showPage: ComputedRef<Partial<QuranPageData>>
  metaPage: ComputedRef<PageReference[]>
  surahMeta: ComputedRef<SurahReference[]>
  juzsMeta: ComputedRef<JuzReference[]>
  
  tarjomeh: Ref<QuranApiResponse<QuranPageData> | undefined>
  audio: Ref<QuranApiResponse<QuranPageData> | undefined>
  
  qari: ComputedRef<Edition[]>
  translator: ComputedRef<Edition[]>
  edition: ComputedRef<Edition[]>
}

export interface UseQuranNavigationReturn {
  selectedSurah: Ref<number>
  selectedAyah: Ref<number>
  selectedJuz: Ref<number>
  pageInput: Ref<number>
  ayahList: ComputedRef<number[]>
  juzNumber: ComputedRef<number | string>
  surahPage: ComputedRef<string>
  ayahNumber: (index: number) => ComputedRef<number | string>
  applyPageChange: () => void
  nextPage: () => void
  previousPage: () => void
  setUpdating: (value: boolean) => void
  updating: Ref<boolean>
}

export interface UseQuranAudioReturn {
  handleAyahClick: (ayah: Ayah) => Promise<void>
  playNextAyah: () => Promise<void>
  playPreviousAyah: () => Promise<void>
  onAudioLoaded: () => Promise<void>
}

export interface UseQuranSearchReturn {
  searchQuery: Ref<string>
  searchResults: Ref<SearchResult | null>
  isSearching: Ref<boolean>
  searchError: Ref<string | null>
  pageSize: number
  page: Ref<number>
  resultsCount: ComputedRef<number>
  hasResults: ComputedRef<boolean>
  paginatedResults: ComputedRef<Ayah[]>
  handleSearch: () => Promise<void>
  clearSearch: () => void
}

export interface UseAppTemplateReturn {
  selectedTemplate: Ref<SelectedTemplate>
  isMobileView: Ref<boolean>
}

export interface UseQuranTextSettingsReturn {
  selectedFont: Ref<string>
  fontSize: Ref<number>
  fontOptions: FontOption[]
  contentStyle: ComputedRef<TextStyle>
  translationStyle: ComputedRef<TextStyle>
  translationFont: string
  increaseFontSize: () => void
  decreaseFontSize: () => void
  resetFontSize: () => void
}

export interface UseNetworkStatusReturn {
  isOnline: Ref<boolean>
}

// ============ Component Props Types ============

export interface QuranFrameProps {
  currentPage?: number
  juzNumber?: number | string
  surahName?: string
  headerStyle?: Record<string, string>
  showHeader?: boolean
}

export interface ErrorStateProps {
  title?: string
  description?: string
}

// ============ Utility Types ============

export type FontOption = {
  label: string
  value: string
}

export type ToastOptions = {
  title: string
  description?: string
}

export interface SearchResult {
  count: number
  matches: Ayah[]
}

export type SelectedTemplate = 'desktop' | 'mobile'

export interface QuranFrameEmits {
  'previous-page': []
  'next-page': []
}

export interface TextStyle {
  fontFamily: string
  fontSize: string
  lineHeight: string
  [key: string]: string
}

