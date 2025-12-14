<template>
  <div dir="rtl" class="space-y-4">

    <div class="space-y-2">
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">فونت</label>
      <USelectMenu
        v-model="selectedFont"
        :items="fontOptions"
         class="min-w-40 hover:cursor-pointer transition ease-in delay-75 hover:shadow-lg"
        :ui="{
        trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
        }"
        value-key="value"
        dir="rtl"
      />
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">اندازه متن</label>
      <div class="flex items-center gap-2">
      <UButton 
        icon="i-heroicons-minus-20-solid"
        @click="$emit('decrease-font')" 
        :disabled="fontSize <= 75"
        color="neutral"
        size="sm"
      />
        <div class="flex-1 text-center font-bold text-lg text-gray-900 dark:text-white">
          {{ fontSize }}%
        </div>
        <UButton 
          icon="i-heroicons-plus-20-solid"
          @click="$emit('increase-font')" 
          :disabled="fontSize >= 200"
          color="neutral"
          size="sm"
        />
      </div>
    </div>

    <UButton 
      @click="$emit('reset-font')"
      color="neutral"
      variant="outline"
      class="w-full"
      icon="i-heroicons-arrow-path-20-solid"
    >
      بازنشانی
    </UButton>

  </div>
</template>

<script setup lang="ts">
import type { FontOption } from '~~/types';

interface Props{
  selectedFont: string,
  fontSize: number,
  fontOptions: FontOption[]
}
const props = withDefaults(defineProps<Props>(),{
  selectedFont: '',
  fontSize: 1,
  fontOptions: ()=> ([])
})

const emit = defineEmits<{
  'update:selectedFont': [value:string]
  'increase-font': []
  'decrease-font': []
  'reset-font': []

}>()

const selectedFont = computed({
  get: () => props.selectedFont,
  set: (value:string) => emit('update:selectedFont', value)
})
</script>
