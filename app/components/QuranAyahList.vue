<template>
  <div>
    <template v-for="(ayah, index) in ayahs" :key="ayah.number">
      
      <div v-if="ayah.numberInSurah === 1" class="text-center mb-6">
        <div class="inline-block border-2 border-amber-800 dark:border-amber-200/80 mb-4 bg-amber-50 dark:bg-inherit rounded py-2 px-8">
          <div class="font-bold text-black dark:text-white" :style="contentStyle">
            {{ removeArabicDiacritics(ayah.surah.name) }}
          </div>
        </div>
        
        <div 
          v-if="ayah.surah.number !== 9 && ayah.surah.number !== 1"
          class="text-center text-black dark:text-white"
          :style="contentStyle"
        >
          بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ
        </div>
      </div>
        
      <span 
        class="inline cursor-pointer px-0.5 py-0.5 rounded transition-colors hover:bg-yellow-100 dark:hover:bg-gray-400/30 text-gray-900 dark:text-amber-50" 
        :class="{ 'bg-green-200 dark:bg-green-800': isHighlighted(ayah) }"
        :data-highlighted="isHighlighted(ayah)"
        :style="contentStyle"
        @click="$emit('ayah-click', ayah)"
    >
        {{ removeBismillah(ayah) }} ﴿{{ convertToArabicNumber(ayah.numberInSurah) }}﴾
      </span>

    </template>
  </div>
</template>

<script setup lang="ts">
import type { Ayah, TextStyle } from '~~/types';

interface Props{
  ayahs: Ayah[],
  contentStyle: TextStyle
  selectedSurah: number,
  selectedAyah: number,
}

const props = withDefaults(defineProps<Props>(), {
  ayahs: () => [],
  contentStyle: () => ({} as TextStyle),
  selectedSurah: 1,
  selectedAyah: 1,
})

defineEmits<{
  'ayah-click':[ayah:Ayah]
}>()

const isHighlighted = (ayah:Ayah) => {
  return props.selectedSurah === ayah.surah.number && 
         ayah.numberInSurah === props.selectedAyah
}

const {removeArabicDiacritics , removeBismillah ,convertToArabicNumber } = useRemoveArabicSigns()

</script>
