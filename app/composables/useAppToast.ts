import type { ToastOptions } from "~~/types/index"

export const useAppToast = () => {
  const toast = useToast()

  return {
    toastSuccess: ({ title, description }: ToastOptions): void => {
      toast.add({
        title,
        icon: 'i-heroicons-check-circle',
        description,  
        color: 'success'
      })
    },

    toastError: ({ title, description }: ToastOptions): void => {
      toast.add({
        title,
        icon: 'i-heroicons-exclamation-circle',
        description,
        color: 'error'
      })
    }
  }
}
