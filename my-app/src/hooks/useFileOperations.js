import { useState } from 'react'
import axios from '../api/axios'

export const useFileOperations = (fetchFiles) => {
  const [error, setError] = useState('')

  // Удаление файла
  const handleDelete = async (fileId) => {
    if (!window.confirm('Вы уверены, что хотите удалить файл?')) {
      return
    }

    try {
      await axios.delete(`/api/storage/${fileId}/`)
      fetchFiles()
    } catch (error) {
      console.error('Delete error:', error)
      setError(error.response?.data?.detail || 'Ошибка удаления файла')
    }
  }

// Переименование файла
const handleRename = async (fileId, currentName) => {
    // Получаем расширение файла из текущего имени
    const fileExtension = currentName.split('.').pop()
    const fileNameWithoutExt = currentName.substring(0, currentName.lastIndexOf('.')) || currentName
    
    const newFileName = prompt(
      'Введите новое имя файла (расширение будет добавлено автоматически):', 
      fileNameWithoutExt
    )
    
    if (!newFileName || newFileName === fileNameWithoutExt) return
  
    // Добавляем расширение файла
    const finalFileName = newFileName.includes('.') 
      ? newFileName 
      : `${newFileName}.${fileExtension}`

    try {
      const formData = new FormData()
      formData.append('original_name', finalFileName)
      
      const response = await axios.patch(`/api/storage/${fileId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      fetchFiles()
    } catch (error) {
      setError(error.response?.data?.detail || 'Ошибка переименования файла')
    }
  }

  // Скачивание файла
  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await axios.get(`/api/storage/${fileId}/download/`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      fetchFiles()
    } catch (error) {
      console.error('Download error:', error)
      setError(error.response?.data?.detail || 'Ошибка скачивания файла')
    }
  }

  // Просмотр файла
  const handleView = async (fileId) => {
    try {
      const response = await axios.get(`/api/storage/${fileId}/view/`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      window.open(url, '_blank')
    } catch (error) {
      console.error('View error:', error)
      setError(error.response?.data?.detail || 'Ошибка просмотра файла')
    }
  }

  // Создание ссылки
  const handleCreateShareLink = async (fileId) => {
    try {
      const response = await axios.post(`/api/storage/${fileId}/share/`)
      const shareLink = `${window.location.origin}/api/storage/share/${response.data.share_link}/`
      await navigator.clipboard.writeText(shareLink)
      alert('Ссылка скопирована в буфер обмена!')
    } catch (error) {
      console.error('Share link error:', error)
      setError(error.response?.data?.detail || 'Ошибка создания ссылки')
    }
  }

  // Удаление ссылки
  const handleRevokeShareLink = async (fileId) => {
    if (!window.confirm('Вы уверены, что хотите удалить ссылку для доступа?')) {
      return
    }

    try {
      await axios.delete(`/api/storage/${fileId}/revoke_share/`)
      alert('Ссылка удалена')
    } catch (error) {
      console.error('Revoke share error:', error)
      setError(error.response?.data?.detail || 'Ошибка удаления ссылки')
    }
  }

  return {
    error,
    setError,
    handleDelete,
    handleRename,
    handleDownload,
    handleView,
    handleCreateShareLink,
    handleRevokeShareLink
  }
}
