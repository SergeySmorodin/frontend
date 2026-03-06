import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from '../../api/axios'

const UserManagement = () => {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
      return
    }
    fetchUsers()
  }, [isAdmin, navigate])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users')
      setUsers(response.data)
      setError('')
    } catch (error) {
      setError('Ошибка загрузки пользователей')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAdmin = async (userId, currentStatus) => {
    try {
      await axios.patch(`/api/admin/users/${userId}/toggle-admin`, {
        isAdmin: !currentStatus
      })
      // Обновляем список пользователей
      setUsers(users.map(u => 
        u.id === userId ? { ...u, isAdmin: !currentStatus } : u
      ))
    } catch (error) {
      setError('Ошибка изменения прав администратора')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Вы уверены, что хотите удалить пользователя?')) {
      return
    }

    try {
      await axios.delete(`/api/admin/users/${userId}`)
      setUsers(users.filter(u => u.id !== userId))
    } catch (error) {
      setError('Ошибка удаления пользователя')
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return <div className="card">Загрузка...</div>
  }

  return (
    <div className="card">
      <h2>Управление пользователями</h2>
      
      {error && (
        <div className="error-message" style={{ marginBottom: '15px' }}>
          {error}
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Логин</th>
            <th>Полное имя</th>
            <th>Email</th>
            <th>Администратор</th>
            <th>Файлы</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.login}</td>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>
                <input
                  type="checkbox"
                  checked={u.isAdmin}
                  onChange={() => handleToggleAdmin(u.id, u.isAdmin)}
                  disabled={u.id === user?.id} // Нельзя изменить свои права
                />
              </td>
              <td>
                {u.storageInfo && (
                  <>
                    <div>Файлов: {u.storageInfo.fileCount}</div>
                    <div>Размер: {formatFileSize(u.storageInfo.totalSize)}</div>
                    <Link to={`/storage/${u.id}`} className="btn btn-success">
                      Управлять
                    </Link>
                  </>
                )}
              </td>
              <td>
                {u.id !== user?.id && (
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="btn btn-danger"
                  >
                    Удалить
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserManagement
