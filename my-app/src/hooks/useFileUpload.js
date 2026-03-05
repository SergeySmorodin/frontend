import { useState } from 'react'
import axios from '../api/axios'
import { formatFileSize } from '../utils/formatters'

export const useFileUpload = (fetchFiles) => {
  const [uploading, setUploading] = useState(false)
  const [comment, setComment] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState('')

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      console.log('File selected:', {
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type
      })
      
      setSelectedFile(file)
      setError('')
    } else {
      setSelectedFile(null)
    }
  }

  const handleClearSelected = () => {
    setSelectedFile(null)
    const fileInput = document.getElementById('file')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    
    if (!selectedFile) {
      setError('Выберите файл для загрузки')
      return
    }
  
    setUploading(true)
    
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('comment', comment)
    formData.append('original_name', selectedFile.name)
    
    try {
      await axios.post('/api/storage/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      
      setSelectedFile(null)
      setComment('')
      const fileInput = document.getElementById('file')
      if (fileInput) fileInput.value = ''
      
      fetchFiles()
      
    } catch (error) {
      console.error('Upload error:', error.response?.data)
      
      let errorMessage = 'Ошибка загрузки файла'
      if (error.response?.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        } else {
          errorMessage = JSON.stringify(error.response.data)
        }
      }
      
      setError(errorMessage)
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
    handleUpload
  }
}
