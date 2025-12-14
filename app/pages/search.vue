<template>
  <QuranFrame
    :header-style="textSettings.translationStyle.value"
    :show-header="false"
  >

    <div class="space-y-6" dir="rtl">
      <div class="flex items-center gap-2 bg-amber-100 dark:bg-amber-600/40 backdrop-blur-sm rounded-2xl p-1.5 shadow-lg transition-all duration-300 hover:shadow-xl border border-amber-200 dark:border-amber-700 ">
        <UInput
          v-model="search.searchQuery.value"
          icon="i-lucide-search"
          size="xl"
          variant="none"
          placeholder="جستجو در قرآن... (حداقل 2 حرف)"
          class="text-amber-900 dark:text-amber-50 flex-1 placeholder-amber-700/60 dark:placeholder-white"
          dir="rtl"
          :disabled="search.isSearching.value"
          @keyup.enter="search.handleSearch"
        />
        <UButton
          v-if="search.searchQuery.value"
          icon="i-lucide-x"
          class="hover:cursor-pointer"
          size="xl"
          color="gray"
          variant="link"
          @click="search.clearSearch"
        />
      </div>

      <!-- Loading -->
      <div v-if="search.isSearching.value" class="space-y-3">
        <USkeleton class="w-full h-20"/>
        <USkeleton class="w-full h-20"/>
        <USkeleton class="w-full h-20"/>
      </div>

      <!-- Error -->
      <div v-else-if="search.searchError.value" class="text-center p-8">
        <UIcon name="i-lucide-alert-circle" class="text-4xl text-red-500 mb-2"/>
        <p class="text-red-600 dark:text-red-400">{{ search.searchError.value }}</p>
      </div>

      <!-- No Results -->
      <div v-else-if="search.searchResults.value && !search.hasResults.value" class="text-center p-8">
        <UIcon name="i-lucide-search-x" class="text-4xl text-gray-400 mb-2"/>
        <p class="text-gray-600 dark:text-gray-400">نتیجه‌ای یافت نشد</p>
      </div>

      <!-- Results -->
      <div v-else-if="search.hasResults.value" class="space-y-4" :style="textSettings.translationStyle.value">
        <div class="text-md text-gray-600 dark:text-gray-400">
          {{ search.resultsCount.value }} نتیجه یافت شد
        </div>

        <!-- Results List -->
        <QuranSearchList 
          :search-results="search.paginatedResults.value"
          :header-style="textSettings.translationStyle.value"
          :content-style="textSettings.contentStyle.value"
        />

        <!-- Pagination -->
        <div class="flex justify-center mt-6">
          <UPagination
            first-icon="i-heroicons-chevron-double-right-20-solid"
            prev-icon="i-heroicons-chevron-right-20-solid"
            next-icon="i-heroicons-chevron-left-20-solid"
            last-icon="i-heroicons-chevron-double-left-20-solid"
            v-model:page="search.page.value" 
            :total="search.resultsCount.value"
            :items-per-page="5"
            active-color="info"
          />
        </div>
      </div>

      <!-- Initial State -->
      <div v-else class="text-center p-16">
        <UIcon name="i-lucide-search" class="text-6xl text-gray-300 dark:text-gray-700 mb-4"/>
        <p class="text-gray-500 dark:text-gray-400">برای جستجو در قرآن، عبارت مورد نظر را وارد کنید</p>
      </div>
    </div>
  </QuranFrame>
</template>

<script setup>
const textSettings = inject('textSettings')
const search = useQuranSearch()
</script>