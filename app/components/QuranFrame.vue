<template>
  <div dir="rtl" class="sm:p-8 bg-amber-100/60 dark:bg-gray-900/30 min-h-screen transition-colors duration-300" :class="{ 'p-2': appTemplate.isMobileView.value }">

    <div v-if="showHeader" class="flex items-center justify-around " :class="{'dark:border-b-2 dark:border-b-amber-600  text-white rounded-b-sm' : appTemplate.isMobileView.value}">

      <div class="text-amber-800 dark:text-amber-400/90 font-bold" :style="headerStyle">
        جزء {{ juzNumber }}
      </div>

      <div class="flex items-center gap-3">
        <UButton
          icon="i-heroicons-chevron-right"
          color="neutral"
          size="sm"
          @click="$emit('previous-page')"
          :disabled="quranData.isLoading.value"
        />
        <span class="text-amber-800 dark:text-amber-400/90 font-bold min-w-12 text-center" :style="headerStyle" >
          {{ currentPage }}
        </span>
        <UButton
          icon="i-heroicons-chevron-left"
          color="neutral"
          size="sm"
          @click="$emit('next-page')"
          :disabled="quranData.isLoading.value"
        />
      </div>

      <div class="text-amber-800 dark:text-amber-400/90 font-bold" :style="headerStyle" >
        {{ removeArabicDiacritics(surahName) }}
      </div>
    </div>

    <div
    :class="{ 'max-w-3xl border-4 border-amber-800  dark:border-amber-600': !appTemplate.isMobileView.value }"   
    class="w-full bg-amber-50/50 dark:bg-gray-800   rounded-lg relative shadow-2xl p-8 transition-colors duration-300">
      
      <!-- main content -->
      <div class="text-justify" dir="rtl">
        <slot />
      </div>

      <div
        class="flex w-full justify-center font-bold text-amber-800 dark:text-amber-400 mt-4" 
        :style="headerStyle"
      >
        {{ currentPage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuranFrameEmits, QuranFrameProps, UseAppTemplateReturn, UseQuranDataReturn } from '~~/types';


withDefaults(defineProps<QuranFrameProps>(), {
  currentPage: 1,
  juzNumber: 1,
  surahName: '',
  headerStyle: ()=>({}),
  showHeader: true
}
)
defineEmits<QuranFrameEmits>()

const quranData = inject<UseQuranDataReturn>('quranData')
if(!quranData){
  throw new Error('quran data must be provided')
}
const appTemplate = inject<UseAppTemplateReturn>('appTemplate')
if(!appTemplate){
  throw new Error
}
const {removeArabicDiacritics} = useRemoveArabicSigns()

</script>