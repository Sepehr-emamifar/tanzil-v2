<template>

  <!-- Desktop Layout -->
  <div 
    v-if="!appTemplate.isMobileView.value" 
    class="fixed bottom-0 left-0 right-0 z-50 bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 shadow-lg transition-colors duration-300"
  >
    <audio 
      ref="internalAudioElement" 
      preload="metadata"
      class="hidden"
      @loadeddata="$emit('audio-loaded')"
      @ended="handleEnded"
    ></audio>

    <div class="container max-w-4xl mx-auto px-4 py-2">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 shrink-0">
          <UButton
            icon="i-heroicons-backward"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="$emit('next-ayah')"
          />

          <UButton
            :icon="isPlaying ? 'i-heroicons-pause-solid' : 'i-heroicons-play-solid'"
            color="neutral"
            size="sm"
            @click="togglePlayPause"
            :loading="quranData.isLoading.value"
          />

          <UButton
            icon="i-heroicons-forward"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="$emit('previous-ayah')"
          />
        </div>
      
        <div class="hidden sm:block h-6 w-px bg-gray-300 dark:bg-gray-700 shrink-0"></div>
      
        <!-- Progress Bar -->
        <div class="hidden sm:flex items-center gap-2 flex-1 min-w-0">
          <span class="text-xs text-gray-600 dark:text-gray-400 min-w-10 text-center shrink-0">
            {{ formatTime(currentTime) }}
          </span>

          <div class="flex-1 min-w-0">
            <USlider 
              v-model="sliderValue"
              :min="0"
              :max="duration || 100"
              :step="0.1"
              @update:model-value="handleSeek"
              size="md"
              color="neutral"
              :disabled="!duration"
              class="cursor-pointer"
            />
          </div>
        
          <span class="text-xs text-gray-600 dark:text-gray-400 min-w-10 text-center shrink-0">
            {{ formatTime(duration) }}
          </span>
        </div>
      
        <div class="h-6 w-px bg-gray-300 dark:bg-gray-700 shrink-0"></div>
      
        <!-- info -->
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
            سوره {{ currentSurah }} - آیه {{ currentAyah }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Layout -->
  <div v-else class="flex flex-col items-center justify-center">
    <audio
      ref="internalAudioElement" 
      preload="metadata"
      class="hidden"
      @loadeddata="$emit('audio-loaded')"
      @ended="handleEnded"
    ></audio>

    <button
      @click="togglePlayPause"
      class="flex flex-col items-center justify-center transition-colors text-gray-600 dark:text-gray-400 hover:cursor-pointer"
    >
      <UIcon 
        :name="isPlaying ? 'i-heroicons-pause-solid' : 'i-heroicons-play-solid'" 
        class="text-3xl"
      />
    </button>

    <!-- Progress Bar Small -->
    <div v-show="played" class="w-full px-4 mt-2">
      <div class="flex items-center gap-2">
        <div class="flex-1">
          <USlider 
            v-model="sliderValue" 
            :min="0" 
            :max="duration || 100"
            :step="0.1"
            @update:model-value="handleSeek"
            size="xs"
            color="info"
            :disabled="!duration"
            class="cursor-pointer"
          />
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import type { UseAppTemplateReturn, UseQuranDataReturn } from '~~/types';

const internalAudioElement = ref<HTMLAudioElement | null>(null)
const isPlaying = ref<boolean>(false)
const currentTime = ref<number>(0)
const duration = ref<number>(0)
const sliderValue = ref<number[]>([0])
const played = ref<boolean>(false)

interface Props{
  currentSurah:number
  currentAyah:number
}
const props = withDefaults(defineProps<Props>(),{
  currentSurah: 1,
  currentAyah: 1,
})

const emit = defineEmits<{
  'previous-ayah':[]
  'next-ayah':[]
  'audio-ended':[]
  'audio-loaded':[]
}>()

const appTemplate = inject<UseAppTemplateReturn>('appTemplate')
if(!appTemplate){
  throw new Error('appTemplate must be provided')
}
const quranData = inject<UseQuranDataReturn>('quranData')
if(!quranData){
  throw new Error('quranData must be provided')
}

const formatTime = (seconds:number):string => {
  if (!seconds || isNaN(seconds)) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const togglePlayPause = ():void => {
  if (!internalAudioElement.value) return
  
  if (isPlaying.value) {
    internalAudioElement.value.pause()
  } else {
    internalAudioElement.value.play()
  }
}

const handleSeek = (value:number[] | undefined) => {
  if (!internalAudioElement.value) return
  
  const seekTime = Array.isArray(value) ? value[0] : value
  if (seekTime === undefined) return

  internalAudioElement.value.currentTime = seekTime
  currentTime.value = seekTime
}

const handleEnded = ():void => {
  isPlaying.value = false
  emit('audio-ended')
  emit('next-ayah')
}

const updateProgress = () => {
  if (!internalAudioElement.value) return
  
  currentTime.value = internalAudioElement.value.currentTime
  sliderValue.value = [internalAudioElement.value.currentTime]
  duration.value = internalAudioElement.value.duration || 0
  isPlaying.value = !internalAudioElement.value.paused
}

const onPlay = () => {
  isPlaying.value = true
  played.value = true
}

const onPause = () => {
  isPlaying.value = false
}

onMounted(() => {
  if (!internalAudioElement.value) return
  
  internalAudioElement.value.addEventListener('timeupdate', updateProgress)
  internalAudioElement.value.addEventListener('loadedmetadata', updateProgress)
  internalAudioElement.value.addEventListener('play', onPlay)
  internalAudioElement.value.addEventListener('pause', onPause)
})

onUnmounted(() => {
  if (!internalAudioElement.value) return
  
  internalAudioElement.value.removeEventListener('timeupdate', updateProgress)
  internalAudioElement.value.removeEventListener('loadedmetadata', updateProgress)
  internalAudioElement.value.removeEventListener('play', onPlay)
  internalAudioElement.value.removeEventListener('pause', onPause)
})

defineExpose({
  audioElement: internalAudioElement,
  isPlaying
})
</script>