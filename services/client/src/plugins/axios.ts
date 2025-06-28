import axios from 'axios'
const apiUrl = import.meta.env.VITE_BACKEND_URI
const apiPort = import.meta.env.VITE_BACKEND_PORT
const apiBaseURL = `http://${apiUrl}:${apiPort}`

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})

export default api
