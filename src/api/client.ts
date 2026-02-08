import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      // TODO: redirect to login or refresh token
    }

    if (status === 403) {
      // TODO: show forbidden notification
    }

    if (status && status >= 500) {
      // TODO: show server error notification
    }

    return Promise.reject(error)
  },
)

export default apiClient
