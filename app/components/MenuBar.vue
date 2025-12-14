<template>
  <div>
    
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">منو</h2>
    </div>
    <div class="space-y-3">
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:border dark:border-gray-700">
        <UCollapsible >
          <UButton
            icon="i-lucide-scroll"
            label="فهرست"
            color="neutral"
            variant="subtle"
            trailing-icon="i-lucide-chevron-down"
            :ui="{
              trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
            }"
            block
            class="group font-semibold text-gray-900 dark:text-white flex items-center justify-between p-4 cursor-pointer  hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors "
          />                
          <template #content>
            
            <div class="p-3">
              <QuranNavigationSelector
                v-model:selected-surah="navigation.selectedSurah.value"
                v-model:selectedAyah="navigation.selectedAyah.value"
                v-model:selectedJuz="navigation.selectedJuz.value"
                :surah-meta="quranData.surahMeta.value"
                :ayah-list="navigation.ayahList.value"
                :juzs-meta="quranData.juzsMeta.value"
              />
            </div>
            <div class="p-3">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 ">شماره صفحه</label>
              <UInput 
                class="min-w-40 hover:cursor-pointer transition ease-in delay-75 hover:shadow-lg"
                v-model.number="navigation.pageInput.value"
                type="number"
                @keyup.enter="navigation.applyPageChange"
                @blur="navigation.applyPageChange"
              />
            </div>
            <div class="flex gap-2 px-3 pt-2 mb-3 justify-around ">
              <UButton 
                @click="navigation.previousPage"
                icon="i-heroicons-chevron-right"
                color="neutral"
                size="md"
                class="hover:cursor-pointer"
              >
                قبلی
              </UButton>
              <UButton 
                @click="navigation.nextPage"
                icon="i-heroicons-chevron-left"
                color="neutral"
                size="md"
                class="hover:cursor-pointer"
                aria-label="صفحه بعد"
              >
                بعدی
              </UButton>
            </div>
          </template>
        </UCollapsible>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:border dark:border-gray-700">
        <UCollapsible>
          <UButton
            label="نسخه ها"
            icon="i-lucide-clipboard-pen"
            color="neutral"
            variant="subtle"
            trailing-icon="i-lucide-chevron-down"
            :ui="{
              trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
            }"
            block
            class="group font-semibold text-gray-900 dark:text-white flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          />
          <template #content>
            
            <div class="p-3 border-t border-gray-200 dark:border-gray-700">
              <QuranQeraatSettings
                v-model:selected-translator="quranData.selectedTranslator.value"
                v-model:selected-qari="quranData.selectedQari.value"
                v-model:selected-edition="quranData.selectedEdition.value"
                :translator="quranData.translator.value"
                :qari="quranData.qari.value"
                :edition="quranData.edition.value"
              />
            </div>
          </template>
        </UCollapsible>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:border dark:border-gray-700">
        <UCollapsible>
          <UButton
            label="فونت"
            icon="i-lucide-type-outline"
            color="neutral"
            variant="subtle"
            trailing-icon="i-lucide-chevron-down"
            :ui="{
              trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
            }"
            block
            class="group font-semibold text-gray-900 dark:text-white flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          />
          <template #content>
              
            <div class="p-3 border-t border-gray-200 dark:border-gray-700">
              <QuranDisplaySettings
                v-model:selected-font="textSettings.selectedFont.value"
                :font-size="textSettings.fontSize.value"
                :font-options="textSettings.fontOptions"
                @increase-font="textSettings.increaseFontSize"
                @decrease-font="textSettings.decreaseFontSize"
                @reset-font="textSettings.resetFontSize"
              />
            </div>
          </template>
        </UCollapsible>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:border dark:border-gray-700">
        <UCollapsible>
          <UButton
            label="تنظیمات"
            icon="i-lucide-settings"
            color="neutral"
            variant="subtle"
            trailing-icon="i-lucide-chevron-down"
            :ui="{
              trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
            }"
            block
            class="group font-semibold text-gray-900 dark:text-white flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          />
          <template #content>
            
            <div class="p-3 border-t border-gray-200 dark:border-gray-700">
              <QuranSettings />
            </div>
          </template>
        </UCollapsible>
      </div>
    </div>
  
  </div>
</template>

<script setup lang="ts">
import type { UseQuranDataReturn, UseQuranNavigationReturn, UseQuranTextSettingsReturn } from '~~/types'


const quranData = inject<UseQuranDataReturn>('quranData')
if(!quranData){
  throw new Error('quranData must be provided')
}

const navigation = inject<UseQuranNavigationReturn>('navigation')
if(!navigation){
  throw new Error('navigation must be provided')
}

const textSettings = inject<UseQuranTextSettingsReturn>('textSettings')
if(!textSettings){
  throw new Error('textSettings must be provided')
}
</script>


