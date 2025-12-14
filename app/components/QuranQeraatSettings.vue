<template>
  <div dir="rtl" class="space-y-4">

    <div class="space-y-2">
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">تفسیر</label>
      <USelectMenu
        v-model="selectedTranslator"
        :items="translatorOptions"
        class="min-w-40 hover:cursor-pointer transition ease-in delay-75 hover:shadow-lg"
        :ui="{
          trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
        }"
        value-key="value"
        dir="rtl"
      />
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">قاری</label>
      <USelectMenu
        v-model="selectedQari"
        :items="qariOptions"
        class="min-w-40 hover:cursor-pointer transition ease-in delay-75 hover:shadow-lg"
        :ui="{
          trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
        }"
        value-key="value"
        dir="rtl"        
      />
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">نسخه</label>
      <USelectMenu
        v-model="selectedEdition"
        :items="editionOptions"
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
import type { Edition } from '~~/types'

interface Props {
  selectedTranslator: string
  selectedQari: string
  selectedEdition: string
  translator: Edition[]
  qari: Edition[]
  edition: Edition[]
}
const props = withDefaults(defineProps<Props>(),{
  selectedTranslator: '',
  selectedQari: '',
  selectedEdition: '',
  translator: ()=> ([]),
  qari: ()=> ([]),
  edition: ()=> ([]),
})

const emit = defineEmits<{
    'update:selectedTranslator': [value:string]
    'update:selectedQari': [value:string]
    'update:selectedEdition': [value:string]
}>()

const selectedTranslator = computed({
  get: () => props.selectedTranslator,
  set: (value: string) => emit('update:selectedTranslator', value)
})

const selectedQari = computed({
  get: () => props.selectedQari,
  set: (value: string) => emit('update:selectedQari', value)
})

const selectedEdition = computed({
  get: () => props.selectedEdition,
  set: (value: string) => emit('update:selectedEdition', value)
})

const translatorOptions = computed(() => 
  props.translator?.map(item => ({
    value: item.identifier,
    label: `${item.language}: ${item.name}`
  })) || []
)

const qariOptions = computed(() => 
  props.qari?.map(item => ({
    value: item.identifier,
    label: `${item.name}`
  })) || []
)

const editionOptions = computed(() => 
  props.edition?.slice(0, 6).map(item => ({
    value: item.identifier,
    label: item.englishName
  })) || []
)
</script>
