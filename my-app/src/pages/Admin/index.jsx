import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios'
import UserManagementHeader from '../../components/Admin/UserManagement/UserManagementHeader'
import UserManagementTable from '../../components/Admin/UserManagement/UserManagementTable'
import UserManagementError from '../../components/common/ErrorMessage'
import UserManagementLoader from '../../components/Admin/UserManagement/UserManagementLoader'

const UserManagement = () => {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Проверка прав доступа
  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
      return
    }
    fetchUsers()
  }, [isAdmin, navigate])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/accounts/users')
      setUsers(response.data)
      setError('')
    } catch {
      setError('Ошибка загрузки пользователей')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAdmin = async (userId, currentStatus) => {
    try {
      await axios.patch(`/api/accounts/users/${userId}/toggle-admin`, {
        isAdmin: !currentStatus
      })
      // Оптимистичное обновление интерфейса
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, isAdmin: !currentStatus } : u
      ))
    } catch {
      setError('Ошибка изменения прав администратора')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Вы уверены, что хотите удалить пользователя?')) {
      return
    }

    try {
      await axios.delete(`/api/accounts/users/${userId}`)
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch {
      setError('Ошибка удаления пользователя')
    }
  }

  // Состояния рендера
  if (loading) {
    return <UserManagementLoader />
  }

  return (
    <div className="card">
      <UserManagementHeader 
        title="Управление пользователями" 
        count={users.length} 
      />
      
      {error && (
        <UserManagementError 
          message={error} 
          onRetry={fetchUsers} 
        />
      )}

      <UserManagementTable
        users={users}
        currentUser={user}
        onToggleAdmin={handleToggleAdmin}
        onDelete={handleDeleteUser}
      />
    </div>
  )
}

export default UserManagement
