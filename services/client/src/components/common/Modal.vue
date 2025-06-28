<template>
  <div class="container mx-auto">
    <div class="flex justify-center">
      <div class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
        <div class="max-w-2xl p-6 mx-4 bg-white rounded-md shadow-xl">
          <div class="flex items-center justify-between">
            <slot name="header"> Modal Title </slot>
            <div @click.prevent="$emit('close')">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-8 h-8 text-red-900 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div>
            <slot name="body">
              <p class="mb-4 text-sm"></p>
            </slot>
            <slot name="footer">
              <button
                class="px-6 py-2 text-blue-800 border border-blue-600 rounded"
                @click.prevent="$emit('close')"
              >
                Cancel
              </button>
              <button class="px-6 py-2 ml-2 text-blue-100 bg-blue-600 rounded">Save</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
