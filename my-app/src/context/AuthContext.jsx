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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      try {
        axios.defaults.headers.common['Authorization'] = `Token ${token}`
        // Эндпоинт для получения текущего пользователя
        const response = await axios.get('/api/accounts/users/me/')
        console.log('User loaded:', response.data)
        setUser(response.data)
      } catch (error) {
        console.error('Failed to load user:', error)
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      } finally {
        setLoading(false)
      }
    }

    loadUserFromToken()
  }, [])

  const login = async (login, password) => {
    try {
      console.log('Login attempt:', { login, password })
      
      const response = await axios.post('/api/accounts/users/login/', {
        username: login,
        password: password
      })
      
      console.log('Login response:', response.data)
      
      const { token, user } = response.data
      
      localStorage.setItem('token', token)

      axios.defaults.headers.common['Authorization'] = `Token ${token}`
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
      const data = {
        username: userData.login,
        full_name: userData.fullName,
        email: userData.email,
        password: userData.password,
        password2: userData.password
      }
      
      const response = await axios.post('/api/accounts/users/register/', data)
      return { success: true, data: response.data }
    } catch (error) {
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
    isAdmin: user?.isAdmin || false
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
