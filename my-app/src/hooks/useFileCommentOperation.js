import { useState } from 'react'
import axios from '../api/axios'

export const useFileCommentOperations = (fetchFiles) => {
  const [error, setError] = useState('')

  const handleEditComment = async (file) => {
    if (!file?.id) {
      console.error('Отсутствует файл для редактирования комментария')
      return
    }
    setError('')
    
    const newComment = window.prompt('Редактировать комментарий:', file.comment || '')
    
    if (newComment === null) return 
    
    try {
      await axios.patch(`/api/storage/${file.id}/`, {
        comment: newComment
      })

      await fetchFiles()
      
    } catch (err) {
      setError(err.userMessage || 'Не удалось сохранить комментарий')
    }
  }

  return {
    error,
    setError,
    handleEditComment,
  }
}
