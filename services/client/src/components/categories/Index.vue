<template>
  <div class="mx-auto bg-grey-lightest">
    <div class="min-h-screen flex flex-col">
      <div class="flex flex-1">
        <main class="bg-white-500 flex-1 p-3 overflow-hidden">
          <div class="flex flex-col">
            <div class="flex flex-1 flex-col md:flex-row lg:flex-row mx-2">
              <div class="mb-2 border-solid border-gray-300 rounded border shadow-sm w-full">
                <div class="flex flex-auto">
                  <div class="bg-gray-200 px-2 py-3 border-solid border-gray-200 border-b w-full">
                    Categories
                    <button
                      @click="openModal = true"
                      class="px-6 py-2 text-blue-800 border border-blue-600 rounded float-right align-top bg-white"
                    >
                      Add Category
                    </button>
                  </div>
                </div>
                <p class="flex flex-row justify-center align-middle mt-2 font-bold" v-if="loading">
                  Categories Loading ...
                </p>
                <div class="p-3" v-else>
                  <table class="table-responsive w-full rounded">
                    <thead>
                      <tr>
                        <th class="border w-1/4 px-4 py-2">Title</th>
                        <th class="border w-1/4 px-4 py-2">Color</th>
                        <th class="border w-1/4 px-4 py-2">Icon</th>
                        <th class="border w-1/5 px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="category in categoryList" :key="category.title">
                        <td class="border px-4 py-2">{{ category.title }}</td>
                        <td class="border px-4 py-2">{{ category.color }}</td>
                        <td class="border px-4 py-2">{{ category.icon }}</td>
                        <td class="border px-4 py-2 flex flex-auto justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                            @click.prevent="editCategory(category.title)"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                            @click.prevent="removeCategory(category.title)"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
  <Modal v-if="openModal" @close="closeModal">
    <template #header> Add/Edit Category </template>
    <template #body>
      <Form :categoryList="categoryList" :category="category" @close="closeModal" />
    </template>
    <template #footer> <div></div></template>
  </Modal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useCategoryStore } from '@/stores/category'

import Modal from '@/components/common/Modal.vue'
import Form from '@/components/categories/Form.vue'

const { categoryList, loading, category } = storeToRefs(useCategoryStore())
const { fetchCategories, deleteCategory, fetchCategoryById } = useCategoryStore()

fetchCategories()

const openModal = ref(false)

const closeModal = async () => {
  openModal.value = false
}
const editCategory = async (title: string) => {
  await fetchCategoryById(title).then(() => {
    openModal.value = !openModal.value
  })
}
const removeCategory = async (title: string) => {
  const result = confirm('Are you sure you want to delete?')
  if (result) {
    await deleteCategory(title)
    fetchCategories()
  }
}
</script>
