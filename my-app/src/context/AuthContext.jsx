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
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/accounts/users/me/')
      setUser(response.data)
    } catch (error) {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (login, password) => {
    try {
      console.log('Данные для входа:', { login, password })
      
      const data = {
        username: login,
        password: password
      }
      
      const response = await axios.post('/api/accounts/users/login/', data)
      
      const { token, user } = response.data
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      return { success: true }
    } catch (error) {
      let errorMessage = 'Ошибка входа'
      if (error.response?.data) {
        // Форматируем сообщение об ошибке
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail
        } else if (error.response.data.non_field_errors) {
          errorMessage = error.response.data.non_field_errors.join(', ')
        } else {
          errorMessage = JSON.stringify(error.response.data)
        }
      }
      
      return { 
        success: false, 
        error: errorMessage 
      }
    }
  }

  const register = async (userData) => {
    try {
      console.log('Данные для регистрации:', userData)
      
      // Форматируем данные для бекенда
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
        const errors = error.response.data
        errorMessage = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n')
      }
      
      return { 
        success: false, 
        error: errorMessage
      }
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
