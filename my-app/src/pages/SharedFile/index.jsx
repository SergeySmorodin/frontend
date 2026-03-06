import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../../api/axios'
import { isImageFile, isPdfFile } from '../../utils/fileHelpers'
import SharedFileHeader from './SharedFileHeader'
import SharedFileActions from './SharedFileActions'
import SharedFileWarning from './SharedFileWarning'
import SharedFileLoader from './SharedFileLoader'
import SharedFileError from './SharedFileError'
import SharedFileMessage from './SharedFileMessage'

const SharedFile = () => {
  const { shareToken } = useParams()
  
  const [fileInfo, setFileInfo] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  // Загрузка метаданных файла
  useEffect(() => {
    const loadFileInfo = async () => {
      if (!shareToken) {
        setError('Токен доступа не указан в URL')
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(`/api/storage/share/${shareToken}/?info=true`)
        setFileInfo(response.data)
        setError('')
      } catch (err) {
        setError(err.response?.data?.detail || 'Ссылка недействительна или файл не найден')
      } finally {
        setLoading(false)
      }
    }

    loadFileInfo()
  }, [shareToken])

  // Скачивание или просмотр файла
  const handleDownload = async () => {
    if (!shareToken || !fileInfo) return
    
    setDownloading(true)
    setError('')

    try {
      const response = await axios.get(`/api/storage/share/${shareToken}/`, {
        responseType: 'blob'
      })

      const contentDisposition = response.headers['content-disposition']
      let fileName = fileInfo.original_name || `file-${shareToken}`
      
      if (contentDisposition) {
        const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (match?.[1]) {
          fileName = match[1].replace(/['"]/g, '')
        }
      }

      const contentType = response.headers['content-type'] || 'application/octet-stream'
      const blob = new Blob([response.data], { type: contentType })
      const blobUrl = window.URL.createObjectURL(blob)

      if (isPdfFile(fileName) || isImageFile(fileName)) {
        window.open(blobUrl, '_blank')
      } else {
        const link = document.createElement('a')
        link.href = blobUrl
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()
      }

      window.URL.revokeObjectURL(blobUrl)
      
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка при скачивании файла')
    } finally {
      setDownloading(false)
    }
  }

  // Состояния рендера
  if (loading) {
    return <SharedFileLoader />
  }

  if (error && !fileInfo) {
    return <SharedFileError message={error} onReturnHome={() => window.location.href = '/'} />
  }

  if (fileInfo) {
    return (
      <div className="container">
        <div className="card" style={{ maxWidth: '500px', margin: '50px auto', padding: '30px' }}>
          
          <SharedFileHeader
            fileName={fileInfo.original_name}
            fileSize={fileInfo.size}
            fileDate={fileInfo.share_token_created}
          />

          <SharedFileMessage 
            message={error} 
            onDismiss={() => setError('')} 
          />

          <SharedFileActions
            fileName={fileInfo.original_name}
            onDownload={handleDownload}
            onPreview={handleDownload}
            disabled={downloading}
          />

          <SharedFileWarning />
          
        </div>
      </div>
    )
  }

  return null
}

export default SharedFile
