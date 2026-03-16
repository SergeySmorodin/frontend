/* eslint-disable react-refresh/only-export-components */
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
      const response = await axios.post('/api/accounts/users/login/', {
        username: login,
        password: password
      })
      
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Token ${token}`
      setUser(user)
      
      return { success: true }
      
    } catch (error) {
      console.error('Login error:', error)
      
      // userMessage из интерцептора
      const errorMessage = error.userMessage || 'Ошибка входа'
      
      // Очищаем токен при 401
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      }
      
      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData) => {
    try {
      const data = {
        username: userData.login,
        full_name: userData.full_name,
        email: userData.email,
        password: userData.password,
        password2: userData.password2
      }
      
      const response = await axios.post('/api/accounts/users/register/', data)
      return { success: true, data: response.data }
      
    } catch (error) {

      const errorMessage = error.userMessage || 'Ошибка регистрации'
      
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
    isAdmin: user?.is_admin || false
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
