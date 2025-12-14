<template>
  <div class="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
    <UIcon 
      name="i-heroicons-exclamation-triangle" 
      class="text-6xl text-red-500 mb-4"
    />
    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
      {{ title }}
    </h3>
    <p class="text-gray-600 dark:text-gray-400 mb-6">
      {{ description }}
    </p>
    <UButton 
      @click="$emit('retry')"
      icon="i-heroicons-arrow-path"
      size="lg"
    >
      تلاش مجدد
    </UButton>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: 'خطایی رخ داده است',
  description: 'لطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.'
})

defineEmits<{
  retry: []
}>()
</script>