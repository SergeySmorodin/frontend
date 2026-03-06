import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../../api/axios'
import { isImageFile, isPdfFile } from '../../utils/fileHelpers'

const SharedFile = () => {
    const { shareToken } = useParams()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
  
    useEffect(() => {
      const loadSharedFile = async () => {
        try {
          console.log('Loading shared file with token:', shareToken)
          
          const response = await axios.get(`/api/storage/share/${shareToken}/`, {
            responseType: 'blob'
          })
          
          console.log('Response headers:', response.headers)
          
          // Получаем имя файла из заголовка Content-Disposition
          const contentDisposition = response.headers['content-disposition']
          let fileName = `shared-${shareToken}`
          
          if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
            if (fileNameMatch && fileNameMatch[1]) {
              fileName = fileNameMatch[1].replace(/['"]/g, '')
            }
          }
          
          const contentType = response.headers['content-type'] || 'application/octet-stream'
          
          console.log('File received:', { fileName, contentType })
          
          const blob = new Blob([response.data], { type: contentType })
          const blobUrl = window.URL.createObjectURL(blob)
          
          // Определяем, как отобразить файл
          if (isPdfFile(fileName) || isImageFile(fileName)) {
            // Для PDF и изображений открываем в новой вкладке
            console.log('Opening in browser:', fileName)
            window.open(blobUrl, '_blank')
            // Закрываем текущую вкладку после открытия файла
            setTimeout(() => window.close(), 1000)
          } else {
            // Для остальных файлов скачиваем
            console.log('Downloading file:', fileName)
            const link = document.createElement('a')
            link.href = blobUrl
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            link.remove()
            // Закрываем текущую вкладку после скачивания
            setTimeout(() => window.close(), 1000)
          }
          
        } catch (error) {
          console.error('Error loading shared file:', error)
          setError(error.response?.data?.detail || 'Файл не найден или ссылка недействительна')
        } finally {
          setLoading(false)
        }
      }
  
      loadSharedFile()
    }, [shareToken])
  
    if (loading) {
      return (
        <div className="container">
          <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Загрузка файла...</h2>
          </div>
        </div>
      )
    }
  
    if (error) {
      return (
        <div className="container">
          <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Ошибка</h2>
            <p style={{ color: '#dc3545' }}>{error}</p>
            <button className="btn" onClick={() => window.location.href = '/'}>
              На главную
            </button>
          </div>
        </div>
      )
    }
  
    return null
  }
  
  export default SharedFile

