import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useModProStore = defineStore('modpro', () => {
  const selectedModules = ref([])

  const addModule = (module) => {
    if (!selectedModules.value.find(m => m.id === module.id)) {
      selectedModules.value.push(module)
    }
  }

  const removeModule = (moduleId) => {
    selectedModules.value = selectedModules.value.filter(m => m.id !== moduleId)
  }

  return {
    selectedModules,
    addModule,
    removeModule
  }
}) 