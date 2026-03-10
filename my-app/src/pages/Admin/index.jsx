import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios'
import UserManagementHeader from '../../components/Admin/UserManagement/UserManagementHeader'
import UserManagementTable from '../../components/Admin/UserManagement/UserManagementTable'
import ErrorMessage from '../../components/common/ErrorMessage'
import UserManagementLoader from '../../components/Admin/UserManagement/UserManagementLoader'

const UserManagement = () => {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  
  // ошибки: критическая (загрузка) и временная (действия)
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
      return
    }
    fetchUsers()
  }, [isAdmin, navigate])

  const fetchUsers = async () => {
    setLoading(true)
    setLoadError('')
    try {
      const response = await axios.get('/api/accounts/users')
      setUsers(response.data)
    } catch (err) {
      setLoadError(err.userMessage || 'Не удалось загрузить список пользователей')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAdmin = async (userId, currentStatus) => {
    setActionError('')
    try {
      await axios.patch(`/api/accounts/users/${userId}/toggle-admin`, {
        is_admin: !currentStatus
      })
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, is_admin: !currentStatus } : u
      ))
    } catch (err) {
      setActionError(err.userMessage || 'Ошибка изменения прав')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Вы уверены, что хотите удалить пользователя?')) {
      return
    }
    setActionError('')

    try {
      await axios.delete(`/api/accounts/users/${userId}`)
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch (err) {
      setActionError(err.userMessage || 'Ошибка удаления пользователя')
    }
  }

  if (loading) {
    return <UserManagementLoader />
  }

  return (
    <div className="card">
      <UserManagementHeader 
        title="Управление пользователями" 
        count={users.length} 
      />
      
      {loadError && (
        <ErrorMessage 
          message={loadError} 
          onRetry={fetchUsers} 
          autoHide={false} 
        />
      )}

      {actionError && (
        <ErrorMessage 
          message={actionError} 
          onDismiss={() => setActionError('')} 
          autoHide={false} 
        />
      )}

      {!loadError && (
        <UserManagementTable
          users={users}
          currentUser={user}
          onToggleAdmin={handleToggleAdmin}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  )
}

export default UserManagement

