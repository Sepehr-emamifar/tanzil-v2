<template>
  <div class="min-h-screen" :class="{ 'max-w-4xl mx-auto shadow-2xl': !appTemplate.isMobileView.value }">
    <AppHeader v-if="!appTemplate.isMobileView.value" />

    <!-- DESKTOP -->
    <div v-if="!appTemplate.isMobileView.value" class="bg-white dark:bg-gray-800 transition-colors duration-300">
      <div class="grid grid-cols-12 min-h-screen" dir="rtl">
        
        <aside class="col-span-3 border-l border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto transition-colors duration-300">
          <MenuBar />
        </aside>

        <main class="col-span-9 pb-6 pr-2 bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
          <UNavigationMenu
            class="mb-0.5"
            dir="rtl"
            :items="items"
            orientation="horizontal" 
            color="info"
            :highlight="true"
            highlight-color="info"
            :ui="{ list: 'gap-2' }"
            variant="pill"
          />
          <slot />
        </main>
      </div>

      <QuranAudioProgressBar
        v-if="$route.path !== '/search'"
        ref="audioProgressBar"
        :current-surah="navigation.selectedSurah.value"
        :current-ayah="navigation.selectedAyah.value"
        @previous-ayah="audio.playPreviousAyah"
        @next-ayah="audio.playNextAyah"
        @audio-loaded="audio.onAudioLoaded"
      />
    </div>

    <!-- MOBILE -->
    <div v-else class="min-h-screen bg-white dark:bg-gray-800 pb-20">
      <main class="w-full">
        <slot />
      </main>

      <div  class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-50">
        <div class="grid grid-cols-5 items-center h-20">
          
           <div class="flex flex-col items-center justify-center h-full transition-colors">
             <NuxtLink
             class="flex flex-col"
             to="/quran"
             :class="$route.path === '/quran' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'"
             >
             <UIcon name="i-lucide-book" class="text-2xl mb-1" />
             <span class="text-xs font-bold">قرآن</span>
            </NuxtLink>
          </div>

           <div class="flex flex-col items-center justify-center h-full transition-colors">
            <NuxtLink
            class="flex flex-col"
            to="/translate"
            :class="$route.path === '/translate' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'"
          >
            <UIcon name="i-lucide-languages" class="text-2xl mb-1" />
            <span class="text-xs font-bold">ترجمه</span>
            </NuxtLink>
          </div>          

          <div >
            <QuranAudioProgressBar
            class="max-w-full"
            ref="audioProgressBar"
            :current-surah="navigation.selectedSurah.value"
            :current-ayah="navigation.selectedAyah.value"
            @previous-ayah="audio.playPreviousAyah"
            @next-ayah="audio.playNextAyah"
            @audio-loaded="audio.onAudioLoaded"
            />
          </div>

          <div class="flex flex-col items-center justify-center h-full transition-colors">
            <NuxtLink
            class="flex flex-col"
            to="/search"
            :class="$route.path === '/search' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'"
          >
            <UIcon name="i-lucide-search" class="text-2xl mb-1" />
            <span class="text-xs font-bold">جستجو</span>
            </NuxtLink>
          </div>

          <div class="flex flex-col items-center justify-center h-full transition-colors">
            <USlideover side="right" class="flex flex-col items-center justify-center h-full transition-colors">
              <UButton label="منو" icon="i-lucide-menu" color="neutral" variant="ghost" />
              <template #body > 
                <MenuBar dir="rtl" />
              </template>
            </USlideover>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>
<script setup lang="ts">
import type { UseQuranDataReturn, UseQuranNavigationReturn, UseQuranTextSettingsReturn, UseQuranAudioReturn, UseAppTemplateReturn } from '~~/types'

interface NavItem {
  label: string
  to: string
  icon: string
}

const items: NavItem[] = [
  {
    label: 'قران',
    to: '/quran',
    icon: 'i-lucide-book',
  },
  {
    label: 'ترجمه',
    to: '/translate',
    icon: 'i-lucide-languages',
  },
  {
    label: 'جستجو',
    to: '/search',
    icon: 'i-lucide-search',
  },
]

const quranData = useQuranData()
const navigation = useQuranNavigation(quranData)
const textSettings = useTextSettings()
const appTemplate = useAppTemplate()

const audioProgressBar = ref<{ audioElement: HTMLAudioElement } | null>(null)

const audioElement = computed(() => audioProgressBar.value?.audioElement || null)
const audio = useQuranAudio(quranData, navigation, audioElement)

const network = useNetworkStatus()

watch(audioElement, (element) => {
  if (element && quranData.audio.value?.data?.ayahs?.length) {
    const findAudioBySurahAndAyah = (surahNumber: number, ayahNumber: number): string | null => {
      const ayahData = quranData.audio.value?.data?.ayahs.find(
        a => a.surah.number === surahNumber && a.numberInSurah === ayahNumber
      )
      return ayahData?.audio || ayahData?.audioSecondary?.[0] || null
    }
    
    const src = findAudioBySurahAndAyah(
      navigation.selectedSurah.value,
      navigation.selectedAyah.value
    )
    
    if (src) {
      element.src = src
      element.load()
    }
  }
}, { immediate: true })

provide<UseQuranDataReturn>('quranData', quranData)
provide<UseQuranNavigationReturn>('navigation', navigation)
provide<UseQuranTextSettingsReturn>('textSettings', textSettings)
provide<UseQuranAudioReturn>('audio', audio)
provide<ComputedRef<HTMLAudioElement | null>>('audioElement', audioElement)
provide<UseAppTemplateReturn>('appTemplate', appTemplate)
provide('network', network)
</script>
