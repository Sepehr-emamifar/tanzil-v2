<template>
  <div class="mb-2">

    <template v-for="(ayah, index) in ayahs" :key="`trans-${ayah.number}`">
        <div v-if="ayah.numberInSurah === 1" class="text-center mb-6">
        <div class="inline-block border-2 border-amber-800 dark:border-amber-200/80 mb-4 bg-amber-50 dark:bg-inherit rounded py-2 px-8">
          <div class="font-bold text-black dark:text-white" :style="contentStyle">
            {{ removeArabicDiacritics(ayah.surah.name) }}
          </div>
        </div>
        </div>

        <span 
            class="text-gray-800 dark:text-amber-50"
            :style="translationStyle"
          >
            {{ translations[index]?.text }}
        </span>    
        <span 
          class="inline-block font-bold text-amber-800 px-1 me-2 dark:text-amber-200"
          :style="translationStyle"
        >
           ({{ ayah.numberInSurah }}) 
        </span>

    </template>
  </div>
</template>

<script setup lang="ts">
import type { Ayah, TextStyle } from '~~/types'

interface Props {
  ayahs: Ayah[]
  translations: Ayah[]
  translationStyle: Record<string,string>,
  contentStyle: Record<string,string>,
}

const props = withDefaults(defineProps<Props>(),{
  ayahs: ()=> ([]),
  translations: ()=> ([]),
  translationStyle: ()=>({}),
  contentStyle:  ()=>({})
})

const { removeArabicDiacritics } = useRemoveArabicSigns()
</script>