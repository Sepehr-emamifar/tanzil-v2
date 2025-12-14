<template>
  <div>
    <NuxtLayout name="default">
        <QuranFrame :show-header="false">
          <div class="flex flex-col items-center justify-center min-h-[250px] text-center">
            <UIcon
              name="i-heroicons-exclamation-triangle" 
              class="text-6xl text-amber-600 dark:text-amber-500"
              style="color: red;"
            />

            <h1 class="text-4xl font-bold text-amber-800 dark:text-amber-400 mb-2">
              Error {{ error?.statusCode }}
            </h1>

            <p class="text-xl text-gray-700 dark:text-gray-300 mb-6 max-w-md">
              {{ errorMessage }}
            </p>
           
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-8 max-w-md">
              {{ error?.message || 'متأسفانه مشکلی پیش آمده است.' }}
            </p>

            <div class="flex gap-3">
              <UButton
                label="بازگشت به صفحه اصلی"
                icon="i-heroicons-home"
                color="primary"
                size="lg"
                @click="handleClearError"
              />
            </div>
          </div>
        </QuranFrame>
    </NuxtLayout>
  </div>
</template>
<script setup>
const props = defineProps({
  error: Object
})

const errorMessage = computed(() => {
  const statusCode = props.error?.statusCode
  
  switch (statusCode) {
    case 404:
      return ' صفحه مورد نظر یافت نشد ):' 
    case 500:
      return 'خطای سرور'
    case 403:
      return 'دسترسی غیرمجاز'
    default:
      return 'خطایی رخ داده است'
  }
})

const handleClearError = () => {
    clearError({ redirect: '/quran' })
    console.clear()
}
</script>