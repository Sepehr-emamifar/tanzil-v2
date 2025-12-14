import type { SelectedTemplate, UseAppTemplateReturn } from "~~/types"

export const useAppTemplate = ():UseAppTemplateReturn => {
  const selectedTemplate = useCookie<SelectedTemplate>('app-template', {
    default: () => 'desktop',
  })

  const isMobileView = ref<boolean>(selectedTemplate.value === 'mobile')

  const checkScreenSize = ():void => {
      if (typeof window === 'undefined') return

      const width = window.innerWidth
      
      if (width < 864 && selectedTemplate.value === 'desktop') {
        isMobileView.value = true
      } else if (selectedTemplate.value === 'mobile') {
        isMobileView.value = true
      } else {
        isMobileView.value = false
      }
    
  }

  watch(selectedTemplate, (newTemplate) => {
    isMobileView.value = newTemplate === 'mobile'
  })

  onMounted(() => {
    checkScreenSize()

    if (typeof window === 'undefined') return

    // if screen is small
    if (!selectedTemplate.value && window.innerWidth < 864) {
      selectedTemplate.value = 'mobile'
    }

    window.addEventListener('resize', checkScreenSize)

    onUnmounted(() => {
      window.removeEventListener('resize', checkScreenSize)
    })
  })

  return {
    selectedTemplate,
    isMobileView
  }
}