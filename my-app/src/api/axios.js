import axios from 'axios'

// Функция для получения CSRF токена из куки
function getCsrfToken() {
  const name = 'csrftoken'
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1]
  return cookieValue
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Интерцептор для добавления токена и CSRF
instance.interceptors.request.use(
  (config) => {
    // Добавляем токен из localStorage при каждом запросе
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Token ${token}`
    }
    
    // Добавляем CSRF токен для всех не-GET запросов
    if (config.method !== 'get') {
      const csrfToken = getCsrfToken()
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken
      }
    }
    
    console.log(`📤 ${config.method.toUpperCase()} ${config.url}`, config.data || '')
    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

// Интерцептор для обработки ответов
instance.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`, response.data)
    return response
  },
  (error) => {
    console.error(`❌ ${error.response?.status} ${error.config?.url}`, error.response?.data)
    
    // Если получили 401 (Unauthorized), очищаем токен
    if (error.response?.status === 401) {
      console.log('Unauthorized, clearing token')
      localStorage.removeItem('token')
    }
    
    return Promise.reject(error)
  }
)

export default instance
