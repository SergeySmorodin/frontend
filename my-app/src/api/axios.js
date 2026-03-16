import axios from 'axios'

// Функция для получения CSRF токена из куки
function getCsrfToken() {
  const name = 'csrftoken'

  if (!document.cookie) return null
  
  const csrfCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
  
  return csrfCookie ? csrfCookie.split('=')[1] : null
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Интерцептор запроса
instance.interceptors.request.use(
  (config) => {
    // Добавляем токен авторизации
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Token ${token}`
    }
    
    // Добавляем CSRF токен только для методов, изменяющих данные
    const safeMethods = ['get', 'head', 'options']
    if (!safeMethods.includes(config.method?.toLowerCase())) {
      const csrfToken = getCsrfToken()
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken
      }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Интерцептор ответа
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Сервер НЕ ответил
    if (!error.response) {
      error.isNetworkError = true
      error.userMessage = 'Ошибка подключения к серверу. Проверьте интернет-соединение или попробуйте позже.'
    } 
    // Сервер ответил, но с ошибкой (4xx, 5xx)
    else {
      error.isNetworkError = false
      const status = error.response.status
      
      switch (status) {
        case 401:
          error.userMessage = 'Неверный логин или пароль'
          localStorage.removeItem('token')
          break
        case 403:
          error.userMessage = 'Доступ запрещён'
          break
        case 404:
          error.userMessage = 'Ресурс не найден'
          break
        case 500:
        case 502:
        case 503:
        case 504:
          error.userMessage = 'Ошибка сервера. Попробуйте немного позже.'
          break
          
        default: {
          const backendMsg = error.response.data?.detail || error.response.data?.message || error.response.data?.non_field_errors
          error.userMessage = backendMsg || `Произошла ошибка (код ${status})`
          break
        }
      }
    }

    return Promise.reject(error)
  }
)

export default instance
