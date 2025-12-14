<template>
        <div
          v-for="result in searchResults"
          :key="result.number"
          class="p-4 bg-amber-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-600 hover:bg-amber-100 dark:hover:bg-gray-700 transition-colors cursor-pointer "
          @click="navigateToAyah(result)"
        >
          <div class="flex justify-between items-start mb-2 gap-5 flex-wrap">
            <div class="text-sm text-gray-600 dark:text-gray-400" :style="headerStyle">
              سوره {{ removeSigns(result.surah.name) }}   آیه ی {{ result.numberInSurah }}
            </div>
          </div>
            <div class="text-amber-900 dark:text-amber-50" :style="contentStyle">
                  {{ result.text }}
            </div>
        </div>
</template>
<script setup lang="ts">
import type { Ayah, UseQuranNavigationReturn } from '../../types/index'

interface Props {
  searchResults: Ayah[],
  headerStyle: Record<string,string>,
  contentStyle: Record<string,string>,
}
withDefaults(defineProps<Props>(),{
  searchResults: ()=> [],
  headerStyle:()=> ({}),
  contentStyle:()=> ({})
})

const navigation = inject<UseQuranNavigationReturn>('navigation')
if (!navigation) {
  throw new Error('Navigation must be provided!')
}

const removeSigns = useRemoveArabicSigns().removeArabicDiacritics

const navigateToAyah = (result: Ayah) :void => {
  navigation.selectedSurah.value = result.surah.number
  navigation.selectedAyah.value = result.numberInSurah
  navigateTo('/quran')
}

</script>