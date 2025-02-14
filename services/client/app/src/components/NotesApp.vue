<template>


        <form>
          <div class="row">
            <input class="input"
              name="title"
              v-model="title"
            />
          </div>
          <div class="row">
            <textarea rows="2" class="input"
              name="content"
              v-model="content"
            >
          </textarea>
          </div>
          
          <div class="row">
            <div
              class="btn btn-outline-secondary btn-sm p-0"
              type="button"
              id="button-addon2"
              @click="handleAddNote()">
              Submit
            </div>
          </div>
        </form>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useNoteStore } from '@/stores/note';
  import { v4 as uuidv4 } from 'uuid';

  const content = ref('');
  const title = ref('');
  const field = ref('');
  const store = useNoteStore();

  function createNote(text: string, content: string) {
    let nd = Date.now();
    let dt = new Date(nd)
    const created_date = (dt.toISOString()).split("T")[0]
    return {id: uuidv4(), title: text, content: content, created_date: created_date};
  }
  
  function handleAddNote() {
    const note = createNote(title.value, content.value);
    store.addNote(note);
    title.value = '';
    content.value = '';
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
  