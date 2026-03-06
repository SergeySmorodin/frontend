import { useState } from 'react'
import axios from '../api/axios'
import {
  getContentTypeFromFileName, 
  isImageFile, 
  isPdfFile  
} from '../utils/fileHelpers'

export const useFileOperations = (fetchFiles) => {
  const [error, setError] = useState('')

  // Удаление файла
  const handleDelete = async (file) => {
    if (!file || !file.id) {
      return
    }

    if (!window.confirm('Вы уверены, что хотите удалить файл?')) {
      return
    }

    try {
      await axios.delete(`/api/storage/${file.id}/`)
      fetchFiles()
    } catch (error) {
      setError(error.response?.data?.detail || 'Ошибка удаления файла')
    }
  }

  // Переименование файла
  const handleRename = async (file) => {
    if (!file || !file.id) {
      return
    }
  
    // Получаем расширение из текущего имени файла
    const currentName = file.original_name
    const lastDotIndex = currentName.lastIndexOf('.')
    const currentExtension = lastDotIndex > 0 ? currentName.substring(lastDotIndex + 1) : ''
    const fileNameWithoutExt = lastDotIndex > 0 ? currentName.substring(0, lastDotIndex) : currentName
  
    // Запрашиваем новое имя
    const newFileName = prompt(
      `Введите новое имя файла (расширение .${currentExtension} будет добавлено автоматически):`,
      fileNameWithoutExt
    )
    
    if (!newFileName || newFileName === fileNameWithoutExt) return
  
    // Добавляем расширение, если его нет
    const finalFileName = newFileName.includes('.') 
      ? newFileName 
      : `${newFileName}.${currentExtension}`
  
    try {
      const formData = new FormData()
      formData.append('original_name', finalFileName)
      
      await axios.patch(`/api/storage/${file.id}/`, formData, {
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
  const handleDownload = async (file) => {
    if (!file || !file.id) {
      return
    }

    try {
      const response = await axios.get(`/api/storage/${file.id}/download/`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', file.original_name)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      fetchFiles()
    } catch (error) {
      setError(error.response?.data?.detail || 'Ошибка скачивания файла')
    }
  }

  // Просмотр файла в браузере
  const handleView = async (file) => {
    if (!file || !file.id) {
      return
    }
  
    try {
      const response = await axios.get(`/api/storage/${file.id}/view/`, {
        responseType: 'blob'
      })
      
      const contentType = response.headers['content-type'] || 
                         getContentTypeFromFileName(file.original_name)
      
      const blob = new Blob([response.data], { type: contentType })
      const url = window.URL.createObjectURL(blob)
      
      if (isPdfFile(file.original_name) || isImageFile(file.original_name)) {
        // Для PDF и изображений открываем в браузере
        window.open(url, '_blank')
      } else {
        // Для остальных файлов скачиваем
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', file.original_name)
        document.body.appendChild(link)
        link.click()
        link.remove()
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'Ошибка просмотра файла')
    }
  }

  // Создание ссылки для доступа
  const handleCreateShareLink = async (file) => {
    if (!file || !file.id) {
      console.error('Отсутствует файл для создания ссылки')
      return
    }
  
    try {
      console.log('Создана ссылка на файл:', file.id)
      
      const response = await axios.post(`/api/storage/${file.id}/share/`)
      console.log('Share link response:', response.data)
      
      // Предполагаем, что сервер возвращает токен в поле share_token
      const shareToken = response.data.share_token || response.data.token
      const shareLink = `${window.location.origin}/api/storage/share/${shareToken}/`
      
      await navigator.clipboard.writeText(shareLink)
      
      // Спрашиваем, открыть ли ссылку сейчас
      if (window.confirm('Ссылка скопирована в буфер обмена! Открыть её в новой вкладке?')) {
        window.open(shareLink, '_blank')
      }
      
    } catch (error) {
      console.error('Ошибка создания ссылки:', error)
      setError(error.response?.data?.detail || 'Ошибка создания ссылки')
    }
  }

  // Удаление ссылки для доступа
  const handleRevokeShareLink = async (file) => {
    if (!file || !file.id) {
      console.error('Нет файла для отмены ссылки')
      return
    }
  
    if (!window.confirm('Вы уверены, что хотите удалить ссылку для общего доступа?')) {
      return
    }
  
    try {
      console.log('Отмена расшаренной ссылки:', file.id)
      
      await axios.delete(`/api/storage/${file.id}/revoke_share/`)
      alert('Ссылка удалена')
      
      // Обновляем список файлов, чтобы убрать признак расшаренного файла
      fetchFiles()
      
    } catch (error) {
      console.error('Ошибка при отмене расшаривания:', error)
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
