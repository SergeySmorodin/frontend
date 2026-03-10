import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useFileOperations } from '../../hooks/useFileOperations'
import { useFileUpload } from '../../hooks/useFileUpload'
import { formatDate, formatFileSize } from '../../utils/formatters'
import UploadForm from '../../components/FilesStorage/UploadForm'
import FileList from '../../components/FilesStorage/FileList'
import FileStorageHeader from '../../components/FilesStorage/FileStorageHeader'
import axios from '../../api/axios'

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
    } catch (err) {
      setError(err.userMessage || err.response?.data?.detail || 'Ошибка загрузки файлов')
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
  } = useFileUpload(fetchFiles, targetUserId)

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

  let ownerName = user?.full_name;

  if (userId && userId !== user?.id) {
    // Если смотрим чужие файлы
    if (files.length > 0 && files[0].owner) {
      ownerName = files[0].owner.full_name;
    } else if (files.length === 0) {
      // Заглушка если нет файлов
      ownerName = `Пользователь #${userId}`; 
    }
  }

  const handleFileAction = (actionId, file) => {
    console.log('Action:', actionId, 'File:', file)
    
    switch(actionId) {
      case 'view': handleView(file); break;
      case 'download': handleDownload(file); break;
      case 'rename': handleRename(file); break;
      case 'share': handleCreateShareLink(file); break;
      case 'revoke': handleRevokeShareLink(file); break;
      case 'delete': handleDelete(file); break;
      default: console.log('Неизвестное действие:', actionId);
    }
  }

  if (loading) {
    return <div className="card">Загрузка...</div>
  }

  return (
    <div className="card">
      <FileStorageHeader
        userName={ownerName}
        // общий список
        isAdminView={isAdmin && !userId}
        isCurrentUser={!userId || userId === user?.id}
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
