import { computed, ref } from 'vue';
import api from '@/plugins/axios'
import moment from 'moment'
import { defineStore } from 'pinia';
import type { INote } from '@/interfaces';


export const useNoteStore = defineStore('note', () => {
  const notes = ref<INote[]>([]);

  async function getNotes() {
    try {
        await api
          .get("/notes")
          .then((response) => {
            notes.value = response.data
          })
          .catch((error) => {
            console.log(error)
          })
      } catch (error) {
        console.log(error)
      }
  } 
  async function addNote(note: INote) {
    notes.value.push(note);
  }

  function removeNote(id: string) {
     notes.value = notes.value.filter((note: INote) => note.id !== id);
  }

  return {
    getNotes,
    addNote,
    removeNote,
    notes
  };
});


// export const useNoteStore = defineStore({
//   id: 'note',
//   state: () => ({
//     notes: [],
//     note: null,
//     loading: false,
//     error: null
//   }),
//   getters: {},
//   actions: {
//     async fetchNotes(q = null) {
//       let url = `/notes`
//       if (q) {
//         url = `notes?q=${q}`
//       }
//       this.notes = []
//       this.loading = true
//       try {
//         await api
//           .get(`${url}`)
//           .then((response) => {
//             this.notes = response.data
//             this.loading = false
//           })
//           .catch((error) => {
//             console.log(error)
//           })
//         this.loading = false
//       } catch (error) {
//         console.log(error)
//       }
//     },
//     async fetchNoteById(id = null) {
//       this.note = null
//       this.loading = true
//       try {
//         await api
//           .get(`/notes/${id}`)
//           .then((response) => {
//             this.note = response.data
//             this.loading = false
//           })
//           .catch((error) => {
//             console.log(error)
//           })
//       } catch (error) {
//         console.log(error)
//       }
//     },
//     async postNote(payload: any) {
//       payload.publish_on = moment().format('LL')
//       try {
//         await api.post('/notes', payload)
//       } catch (error) {
//         console.log(error)
//       }
//     },
//     async updateNote(payload: any) {
//       try {
//         await api.put(`/notes/${payload.id}`, payload)
//       } catch (error) {
//         console.log(error)
//       }
//     },
//     async remoteNote(id: number) {
//       try {
//         await api.delete(`/notes/${id}`)
//       } catch (error) {
//         console.log(error)
//       }
//     },
//     async resetPost() {
//       this.note = null
//     }
//   }
// })
