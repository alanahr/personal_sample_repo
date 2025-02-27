<template>
  <div class="flex w-full">
    <div class="shadow-sm w-full">
      <div class="p-3">
        <form class="w-full">
          <div class="flex flex-wrap -mx-3 mb-2">
            <div class="w-full px-3 mt-6 md:mb-0">
              <label
                class="block uppercase tracking-wide text-grey-darker text-xs font-light mb-1"
                for="grid-title"
              >
                Title
              </label>

              <input
                class="appearance-none block w-full bg-grey-200 text-grey-darker border border-grey-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-grey"
                id="grid-title"
                type="text"
                placeholder="Title"
                v-model="title"
              />
            </div>
            <div class="w-full px-3 mt-6 md:mb-0">
              <label
                class="block uppercase tracking-wide text-grey-darker text-xs font-light mb-1"
                for="grid-color"
              >
                Color
              </label>

              <input
                class="appearance-none block w-full bg-grey-200 text-grey-darker border border-grey-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-grey"
                id="grid-color"
                type="text"
                placeholder="color"
                v-model="color"
              />
            </div>
            <div class="w-full px-3 mt-6 md:mb-0">
              <label
                class="block uppercase tracking-wide text-grey-darker text-xs font-light mb-1"
                for="grid-icon"
              >
                Icon
              </label>

              <input
                class="appearance-none block w-full bg-grey-200 text-grey-darker border border-grey-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-grey"
                id="grid-icon"
                type="text"
                placeholder="icon"
                v-model="icon"
              />
            </div>
          </div>
          <div class="flex flex-row justify-end mt-5">
            <button
              class="px-6 py-2 text-blue-800 border border-blue-600 rounded"
              @click.prevent="$emit('close')"
            >
              Cancel
            </button>
            <button
              class="px-6 py-2 ml-2 text-blue-100 bg-blue-600 rounded"
              type="button"
              @click="handleAddCategory()"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCategoryStore } from '@/stores/category'

const color = ref('')
const title = ref('')
const icon = ref('')

const store = useCategoryStore()

function createCategory(title: string, color: string, icon: string) {
  return { title: title, color: color, icon: icon }
}

function handleAddCategory() {
  const cat = createCategory(title.value, color.value, icon.value)
  store.storeCategory(cat)
  title.value = ''
  color.value = ''
  icon.value = ''
}
</script>

<style scoped>
.input {
  margin: 15px 0;
}
.icon {
  margin-right: 10px;
}
.line-through {
  text-decoration: line-through;
}
.text-bold {
  font-weight: 700;
}
</style>
