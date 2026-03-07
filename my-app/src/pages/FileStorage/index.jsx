import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useFileOperations } from '../../hooks/useFileOperations'
import { useFileUpload } from '../../hooks/useFileUpload'
import { formatDate, formatFileSize } from '../../utils/formatters'
import UploadForm from '../../components/Files/UploadForm'
import FileList from '../../components/Files/FileList'
import axios from '../../api/axios'
import FileStorageHeader from './FileStorageHeader'

const FileStorage = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const targetUserId = userId || user?.id


  const fetchFiles = async () => {
    try {
      const url = (targetUserId && targetUserId !== user?.id)
        ? `/api/storage/?user_id=${targetUserId}`
        : '/api/storage/'
      
      const response = await axios.get(url)
      setFiles(response.data)
      setError('')
    } catch (error) {
      setError(error.response?.data?.detail || 'Ошибка загрузки файлов')
    } finally {
      setLoading(false)
    }
  }

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

  useEffect(() => {
    if (opError) setError(opError)
    if (uploadError) setError(uploadError)
  }, [opError, uploadError])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUserId, isAdmin, navigate, user?.id])

  const handleFileAction = (actionId, file) => {
    console.log('Action:', actionId, 'File:', file)
    
    switch(actionId) {
      case 'view':
        handleView(file)
        break
      case 'download':
        handleDownload(file)
        break
      case 'rename':
        handleRename(file)
        break
      case 'share':
        handleCreateShareLink(file)
        break
      case 'revoke':
        handleRevokeShareLink(file)
        break
      case 'delete':
        handleDelete(file)
        break
      default:
        console.log('Неизвестное действие:', actionId)
    }
  }

  if (loading) {
    return <div className="card">Загрузка...</div>
  }

  return (
    <div className="card">
      <FileStorageHeader
        userName={user?.full_name}
        isCurrentUser={!userId}
        error={error}
        onClearError={() => setError('')}
      />

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
