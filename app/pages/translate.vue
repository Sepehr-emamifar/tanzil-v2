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
      <USkeleton class="w-full h-12 bg-amber-100 dark:bg-gray-700/90" />
      <USkeleton class="w-full h-12 bg-amber-100 dark:bg-gray-700/90"/>
      <USkeleton class="w-full h-12 bg-amber-100 dark:bg-gray-700/90"/>
      <USkeleton class="w-full h-12 bg-amber-100 dark:bg-gray-700/90"/>
      <USkeleton class="w-full h-12 bg-amber-100 dark:bg-gray-700/90"/>
      <USkeleton class="w-full h-12 bg-amber-100 dark:bg-gray-700/90"/>
      <USkeleton class="w-full h-12 bg-amber-100 dark:bg-gray-700/90"/>
    </div>
    <QuranTranslationList
      v-else
      :content-style="textSettings.contentStyle.value"
      :ayahs="quranData.showPage.value?.ayahs || []"
      :translations="quranData.tarjomeh.value?.data?.ayahs"
      :translation-style="textSettings.translationStyle.value"
    />
  </QuranFrame>
</template>

<script setup>
const quranData = inject('quranData')
const navigation = inject('navigation')
const textSettings = inject('textSettings')
const network = inject('network')

const handleRetry = async () => {
  
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
