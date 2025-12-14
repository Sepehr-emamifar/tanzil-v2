import type { Ayah, SearchResult, UseQuranSearchReturn } from "~~/types"

export const useQuranSearch = ():UseQuranSearchReturn => {
  const searchQuery = ref<string>('')
  const searchResults = ref<SearchResult | null>(null)
  const isSearching = ref<boolean>(false)
  const searchError = ref<string|null>(null)
  const page = ref<number>(1)
  const pageSize:number = 5

  const lastSearchQuery = useCookie<string>('quran-last-search', {
    default: () => '',
  })

  const handleSearch = async ():Promise<void> => {

    if (!searchQuery.value || searchQuery.value.trim().length < 2) {
      searchResults.value = null
      return
    }

    try {
      isSearching.value = true
      searchError.value = null

      const response = await $fetch<{data:SearchResult}>(
        `https://api.alquran.cloud/v1/search/${encodeURIComponent(searchQuery.value.trim())}/all/quran-simple-clean`
      )

      searchResults.value = response?.data || null
      lastSearchQuery.value = searchQuery.value.trim()

    } catch (error) {
      console.error('Search error:', error)
      searchError.value = 'خطا در جستجو. لطفاً دوباره تلاش کنید.'
      searchResults.value = null
    } finally {
      isSearching.value = false
    }
  }

  const clearSearch = ():void => {
    searchQuery.value = ''
    searchResults.value = null
    searchError.value = null
  }

  onMounted(() => {
    if (lastSearchQuery.value) {
      searchQuery.value = lastSearchQuery.value
    }
  })

  const resultsCount = computed<number>(() => {
    return searchResults.value?.count || 0
  })

  const hasResults = computed<boolean>(() => {
    return resultsCount.value > 0
  })
  
  const paginatedResults = computed<Ayah[]>(() => {
  if (!searchResults.value?.matches) return []
  
  const start = (page.value - 1) * pageSize
  const end = start + pageSize
  
  return searchResults.value.matches.slice(start, end)

  })
  return {
    searchQuery,
    searchResults,
    isSearching,
    searchError,
    pageSize,
    page,
    resultsCount,
    hasResults,
    paginatedResults,
    handleSearch,
    clearSearch
  }
}
