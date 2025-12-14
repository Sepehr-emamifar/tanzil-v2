<template>
  <div dir="rtl" class="space-y-4">
    
    <div class="space-y-2">
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">سوره</label>
      <USelectMenu
        v-model="selectedSurah"
        :items="surahOptions"
        class="min-w-40 hover:cursor-pointer transition ease-in delay-75 hover:shadow-lg"
        :ui="{
        trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
        }"
        value-key="value"
        dir="rtl"
      />
    </div>

    <div class="space-y-2" >
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">آیه</label>
      <USelectMenu
        v-model="selectedAyah"
        :items="ayahOptions"
        class="min-w-40 hover:cursor-pointer transition ease-in delay-75 hover:shadow-lg"
        :ui="{
        trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
        }"
        value-key="value"
        dir="rtl"
      />
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">جزء</label>
      <USelectMenu
        v-model="selectedJuz"
        :items="juzOptions"
        class="min-w-40 hover:cursor-pointer transition ease-in delay-75 hover:shadow-lg"
        :ui="{
        trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
        }"
        value-key="value"
        dir="rtl"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import type { SurahReference, JuzReference } from '~~/types'

interface Props {
  selectedSurah: number
  selectedAyah: number
  selectedJuz: number
  surahMeta: SurahReference[]
  ayahList: number[]
  juzsMeta: JuzReference[]
}
const props = withDefaults(defineProps<Props>(), {
  selectedSurah: 1,
  selectedAyah: 1,
  selectedJuz: 1,
  surahMeta: () => ([]),
  ayahList: () => ([]),
  juzsMeta: () => ([])
})

const emit = defineEmits<{
  'update:selectedSurah': [value:number]
  'update:selectedAyah': [value:number]
  'update:selectedJuz':[value:number]
}>()

const selectedSurah = computed({
  get: () => props.selectedSurah,
  set: (value: number) => emit('update:selectedSurah', value)
})

const selectedAyah = computed({
  get: () => props.selectedAyah,
  set: (value: number) => emit('update:selectedAyah', value)
})

const selectedJuz = computed({
  get: () => props.selectedJuz,
  set: (value: number) => emit('update:selectedJuz', value)
})

const {removeArabicDiacritics} = useRemoveArabicSigns()

const surahOptions = computed(() => 
  props.surahMeta?.map(item => ({
    value: item.number,
    label: `${item.number}. ${removeArabicDiacritics(item.name)}`
  })) || []
)

const ayahOptions = computed(() => 
  props.ayahList?.map(item => ({
    value: item,
    label: `آیه ${item}`
  })) || []
)

const juzOptions = computed(() => 
  props.juzsMeta?.map((item, i) => ({
    value: i + 1,
    label: `جزء ${i + 1}`
  })) || []
)
</script>
