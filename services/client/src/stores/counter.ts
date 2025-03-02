import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/plugins/axios'


export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const useHealthStore = defineStore('health', {
  state: () => {
    return {
      data: []
    }
  },
  actions: {
    async fetchHealth() {
      let url = `/health`
      this.data = []
      try {
        await api
          .get(`${url}`)
          .then((response) => {
            this.data = response.data
          })
          .catch((error) => {
            console.error(error)
          })
      } catch (error) {
        console.error(error)
      }
    },
  }
})


