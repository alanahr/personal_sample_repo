import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import { v4 as uuidv4 } from 'uuid'

export const useCategoryStore = defineStore('category', {
  state: () => {
    return {
      // for initially empty lists
      categoryList: [] as CategoryInfo[],
      // for data that is not yet loaded
      category: null as CategoryInfo | null,
      loading: false,
      error: false,
    }
  },
  getters: {
    firstCategory: (state) => state.categoryList[0],
  },
  actions: {
    async fetchCategories(q = null) {
      let url = `/categories`
      if (q) {
        url = `categories?q=${q}`
      }
      this.categoryList = []
      this.loading = true
      this.error = false
      try {
        await api
          .get(`${url}`)
          .then((response) => {
            this.categoryList = response.data
            this.loading = false
          })
          .catch((error) => {
            this.error = true
            console.log(error)
          })
        this.loading = false
      } catch (error) {
        this.error = true
        console.log(error)
      }
    },
    async fetchCategoryById(title: string) {
      let url = `/categories`
      if (title) {
        url = `categories/${title}`
      }
      this.category = null
      this.loading = true
      this.error = false
      try {
        await api
          .get(`${url}`)
          .then((response) => {
            this.category = response.data
            console.debug('this loading false in then after await')
            this.loading = false
          })
          .catch((error) => {
            this.error = true
            console.error(error)
          })
        console.debug('this loading false below await')
        this.loading = false
      } catch (error) {
        this.error = true
        console.error(error)
      }
    },
    async storeCategory(payload: CategoryInfo) {
      this.category = null
      this.loading = true
      this.error = false
      try {
        await api.post('/categories', payload).then((response) => {
          this.category = response.data
          this.loading = false
        })
      } catch (error) {
        console.error(error)
        this.error = true
      }
    },
    async updateCategory(title: string, payload: CategoryInfo) {
      this.category = null
      this.loading = true
      this.error = false
      try {
        await api.post(`categories/${title}`, payload).then((response) => {
          this.category = response.data
          this.loading = false
        })
      } catch (error) {
        console.error(error)
        this.error = true
      }
    },
    async deleteCategory(title: string) {
      this.loading = true
      this.error = false
      try {
        await api.delete(`categories/${title}`).then((response) => {
          console.log(response.data)
          this.loading = false
        })
        this.loading = false
      } catch (error) {
        console.error(error)
        this.error = true
      }
    },
  },
})

interface CategoryInfo {
  title: string
  color: string
  icon: string
}
