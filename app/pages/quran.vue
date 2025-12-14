<template>
  <QuranFrame
    :show-header="false"
    v-if="quranData.hasError.value"
  >
    <ErrorState 
    title="خطا در بارگذاری"
    description="لطفاً اتصال اینترنت خود را بررسی کنید"
    @retry="handleRetry"
    />
  </QuranFrame>
  <QuranFrame
    v-else
    :current-page="quranData.showPage.value?.ayahs?.[0]?.page"
    :juz-number="navigation.juzNumber.value"
    :surah-name="navigation.surahPage.value"
    :header-style="textSettings.translationStyle.value"
    @previous-page="navigation.previousPage"
    @next-page="navigation.nextPage"
  >
    <div v-if="quranData.isLoading.value" class="space-y-3 p-6">
      <USkeleton class="w-1/2 mx-auto h-12 bg-amber-100 dark:bg-gray-700/90"/>
      <USkeleton class="w-full h-12 bg-amber-100 dark:bg-gray-700/90"/>
      <USkeleton class="w-full h-12 bg-amber-100 dark:bg-gray-700/90"/>
      <USkeleton class="w-full h-12 bg-amber-100 dark:bg-gray-700/90"/>
      <USkeleton class="w-full h-12 bg-amber-100 dark:bg-gray-700/90"/>
      <USkeleton class="w-full h-12 bg-amber-100 dark:bg-gray-700/90"/>
      <USkeleton class="w-full h-12 bg-amber-100 dark:bg-gray-700/90"/>
    </div>
    <QuranAyahList
      v-else
      :ayahs="quranData.showPage.value?.ayahs || []"
      :content-style="textSettings.contentStyle.value"
      :selected-surah="navigation.selectedSurah.value"
      :selected-ayah="navigation.selectedAyah.value"
      @ayah-click="audio.handleAyahClick"
    />
  </QuranFrame>
</template>

<script setup lang="ts">
import type { UseNetworkStatusReturn, UseQuranAudioReturn, UseQuranDataReturn, UseQuranNavigationReturn, UseQuranTextSettingsReturn } from '~~/types'

const quranData = inject<UseQuranDataReturn>('quranData')!
const navigation = inject<UseQuranNavigationReturn>('navigation')!
const textSettings = inject<UseQuranTextSettingsReturn>('textSettings')!
const audio = inject<UseQuranAudioReturn>('audio')!
const toast = useAppToast()
const network = inject<UseNetworkStatusReturn>('network')!

const handleRetry = async ():Promise<void> => {
  
  if (!network.isOnline.value) {
    toast.toastError({
      title: 'اتصال اینترنت قطع است',
      description: 'لطفاً ابتدا اتصال خود را برقرار کنید'
    })
    return
  }

  await quranData.refreshAll()
  
  await nextTick()
  
  if (quranData.hasError.value) {
    toast.toastError({
      title: 'بارگذاری ناموفق',
      description: 'خطا در دریافت اطلاعات. دوباره تلاش کنید'
    })
  } else {
    toast.toastSuccess({
      title: 'بارگذاری موفق',
      description: 'اطلاعات با موفقیت بارگذاری شد'
    })
  }
}
</script>
