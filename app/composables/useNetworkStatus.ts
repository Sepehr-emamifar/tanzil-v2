import type { UseNetworkStatusReturn } from "~~/types"

export const useNetworkStatus = ():UseNetworkStatusReturn => {
  const isOnline: Ref<boolean> = ref(true)
  const toast = useAppToast()

  const updateOnlineStatus = ():void => {
    isOnline.value = navigator.onLine
    
    if (!isOnline.value) {
      toast.toastError({
        title: 'اتصال اینترنت قطع شد',
        description: 'لطفاً اتصال خود را بررسی کنید'
      })
    } else {
      toast.toastSuccess({
        title: 'اتصال برقرار شد',
        description: 'اتصال اینترنت شما برقرار شد'
      })
    }
  }

  onMounted(() => {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
  })

  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
  })

  return {
    isOnline
  }
}