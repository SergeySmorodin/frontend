import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from '../api/axios'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // Добавляем состояние загрузки

  useEffect(() => {
    // Функция для проверки токена и загрузки пользователя
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('token')
      console.log('Loading user from token:', token ? 'Token exists' : 'No token')
      
      if (!token) {
        setLoading(false)
        return
      }

      try {
        // Устанавливаем токен в заголовки axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        // Запрашиваем данные пользователя
        const response = await axios.get('/api/accounts/users/me/')
        console.log('User loaded:', response.data)
        
        setUser(response.data)
      } catch (error) {
        console.error('Failed to load user:', error)
        // Если токен невалидный, удаляем его
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      } finally {
        setLoading(false)
      }
    }

    loadUserFromToken()
  }, []) // Пустой массив зависимостей - выполняется только при монтировании

  const login = async (login, password) => {
    try {
      console.log('Login attempt:', { login, password })
      
      const response = await axios.post('/api/accounts/users/login/', {
        username: login,
        password: password
      })
      
      console.log('Login response:', response.data)
      
      const { token, user } = response.data
      
      // Сохраняем токен в localStorage
      localStorage.setItem('token', token)
      
      // Устанавливаем токен в заголовки axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(user)
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      
      let errorMessage = 'Ошибка входа'
      if (error.response?.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail
        } else if (error.response.data.non_field_errors) {
          errorMessage = error.response.data.non_field_errors[0]
        } else {
          errorMessage = JSON.stringify(error.response.data)
        }
      }
      
      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData) => {
    try {
      console.log('Registration data:', userData)
      
      const data = {
        username: userData.login,
        full_name: userData.fullName,
        email: userData.email,
        password: userData.password,
        password2: userData.password
      }
      
      const response = await axios.post('/api/accounts/users/register/', data)
      console.log('Registration response:', response.data)
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Registration error:', error)
      
      let errorMessage = 'Ошибка регистрации'
      if (error.response?.data) {
        const errorData = error.response.data
        if (typeof errorData === 'string') {
          errorMessage = errorData
        } else if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors[0]
        } else {
          const fieldErrors = []
          Object.keys(errorData).forEach(field => {
            const messages = errorData[field]
            if (Array.isArray(messages)) {
              fieldErrors.push(`${field}: ${messages.join(', ')}`)
            } else {
              fieldErrors.push(`${field}: ${messages}`)
            }
          })
          errorMessage = fieldErrors.join('\n')
        }
      }
      
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    console.log('Logging out')
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || user?.is_admin || false
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
