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

  const value = {
    user,
    register,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
