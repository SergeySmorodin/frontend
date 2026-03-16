import { useState, useRef } from 'react'
import axios from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { formatFileSize } from '../utils/formatters'
import { validateFile } from '../utils/validation'

export const useFileUpload = (fetchFiles, targetUserId = null) => {
  const { user: currentUser } = useAuth()
  const fileInputRef = useRef(null)
  
  const [uploading, setUploading] = useState(false)
  const [comment, setComment] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState('')


  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    
    if (file) {

      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        setSelectedFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('File selected:', {
          name: file.name,
          size: formatFileSize(file.size),
          type: file.type
        })
      }
      
      setSelectedFile(file)
      setError('')
    } else {
      setSelectedFile(null)
    }
  }

  const handleClearSelected = () => {
    setSelectedFile(null)
    setComment('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setError('')
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    
    setError('')
    
    if (!selectedFile) {
      setError('Выберите файл для загрузки')
      return
    }
  
    setUploading(true)
    
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('comment', comment)
    formData.append('original_name', selectedFile.name)
    
    if (currentUser?.is_admin && targetUserId) {
      formData.append('user', targetUserId)
    }
    
    try {
      await axios.post('/api/storage/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      
      // Успешная загрузка — сбрасываем форму
      handleClearSelected()
      fetchFiles()
      
    } catch (error) {

      const errorMessage = error.userMessage || 
                          error.response?.data?.detail || 
                          'Ошибка загрузки файла'
      
      setError(errorMessage)
      
      if (process.env.NODE_ENV === 'development') {
        console.error('Upload error:', error)
      }
    } finally {
      setUploading(false)
    }
  }

  return {
    uploading,
    comment,
    setComment,
    selectedFile,
    error,
    handleFileSelect,
    handleClearSelected,
    handleUpload,
    fileInputRef
  }
}
