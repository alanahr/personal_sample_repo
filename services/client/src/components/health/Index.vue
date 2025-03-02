<template>
  <div class="mx-auto bg-grey-lightest">
    <div class="min-h-screen flex flex-col">
      <div class="flex flex-1">
        {{ data }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useHealthStore } from '@/stores/counter'

const { data } = storeToRefs(useHealthStore())
const { fetchHealth } = useHealthStore()

fetchHealth()

</script>
