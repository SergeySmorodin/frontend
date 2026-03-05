import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useFileOperations } from '../../hooks/useFileOperations'
import { useFileUpload } from '../../hooks/useFileUpload'
import { formatDate, formatFileSize } from '../../utils/formatters'
import UploadForm from './UploadForm'
import FileList from './FileList'
import axios from '../../api/axios'

const FileStorage = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const targetUserId = userId || user?.id

  // Загрузка файлов
  const fetchFiles = async () => {
    try {
      console.log('Fetching files for user:', targetUserId)
      const response = await axios.get('/api/storage/')
      setFiles(response.data)
      setError('')
    } catch (error) {
      console.error('Error fetching files:', error)
      setError(error.response?.data?.detail || 'Ошибка загрузки файлов')
    } finally {
      setLoading(false)
    }
  }

  // Операции с файлами
  const { 
    error: opError, 
    setError: setOpError,
    handleDelete,
    handleRename,
    handleDownload,
    handleView,
    handleCreateShareLink,
    handleRevokeShareLink
  } = useFileOperations(fetchFiles)

  // Загрузка файлов
  const {
    uploading,
    comment,
    setComment,
    selectedFile,
    error: uploadError,
    handleFileSelect,
    handleClearSelected,
    handleUpload
  } = useFileUpload(fetchFiles, formatFileSize)

  // Объединяем ошибки
  useEffect(() => {
    if (opError) setError(opError)
    if (uploadError) setError(uploadError)
  }, [opError, uploadError])

  // Проверка доступа
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!isAdmin && userId && userId !== user?.id) {
      navigate('/storage')
      return
    }

    fetchFiles()
  }, [targetUserId, user, isAdmin, userId, navigate])

  // Обработчик действий с файлами
  const handleFileAction = (action, fileId, fileName) => {
    switch(action) {
      case 'download':
        handleDownload(fileId, fileName)
        break
      case 'view':
        handleView(fileId)
        break
      case 'rename':
        handleRename(fileId, fileName)
        break
      case 'share':
        handleCreateShareLink(fileId)
        break
      case 'revoke':
        handleRevokeShareLink(fileId)
        break
      case 'delete':
        handleDelete(fileId)
        break
      default:
        break
    }
  }

  if (loading) {
    return <div className="card">Загрузка...</div>
  }

  return (
    <div className="card">
      <h2>
        Управление файлами
        {!userId && <span> пользователя {user?.fullName}</span>}
      </h2>

      {error && (
        <div className="error-message" style={{ 
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px'
        }}>
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      <UploadForm
        onSubmit={handleUpload}
        onFileSelect={handleFileSelect}
        onClearSelected={handleClearSelected}
        comment={comment}
        onCommentChange={setComment}
        selectedFile={selectedFile}
        uploading={uploading}
        error={uploadError}
        formatFileSize={formatFileSize}
      />

      <h3>Список файлов</h3>
      
      <FileList
        files={files}
        onFileAction={handleFileAction}
        formatDate={formatDate}
        formatFileSize={formatFileSize}
      />
    </div>
  )
}

export default FileStorage
