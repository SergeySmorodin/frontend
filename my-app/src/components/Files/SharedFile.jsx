// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import axios from '../../api/axios'
// import { getFileIcon, isImageFile, isPdfFile } from '../../utils/fileHelpers'
// import { formatFileSize, formatDate } from '../../utils/formatters'

// const SharedFile = () => {
//   const { shareToken } = useParams()
  
//   const [fileInfo, setFileInfo] = useState(null)
//   const [downloading, setDownloading] = useState(false)
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(true)

//   // 1️⃣ Сначала загружаем только информацию о файле (метаданные)
//   useEffect(() => {
//     const loadFileInfo = async () => {
//       if (!shareToken) {
//         setError('Токен доступа не указан в URL')
//         setLoading(false)
//         return
//       }

//       try {
//         // Запрашиваем только информацию, а не сам файл
//         const response = await axios.get(`/api/storage/share/${shareToken}/?info=true`)
//         setFileInfo(response.data)
//         setError('')
//       } catch (err) {
//         console.error('Error loading file info:', err)
//         setError(err.response?.data?.detail || 'Ссылка недействительна или файл не найден')
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadFileInfo()
//   }, [shareToken])

//   // 2️⃣ Скачивание файла по клику на кнопку
//   const handleDownload = async () => {
//     if (!shareToken || !fileInfo) return
    
//     setDownloading(true)
//     setError('')

//     try {
//       // Теперь запрашиваем сам файл как blob
//       const response = await axios.get(`/api/storage/share/${shareToken}/`, {
//         responseType: 'blob'
//       })

//       const contentDisposition = response.headers['content-disposition']
//       let fileName = fileInfo.original_name || `file-${shareToken}`
      
//       if (contentDisposition) {
//         const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
//         if (match?.[1]) {
//           fileName = match[1].replace(/['"]/g, '')
//         }
//       }

//       const contentType = response.headers['content-type'] || 'application/octet-stream'
//       const blob = new Blob([response.data], { type: contentType })
//       const blobUrl = window.URL.createObjectURL(blob)

//       // Для PDF и изображений — открываем в новой вкладке, иначе — скачиваем
//       if (isPdfFile(fileName) || isImageFile(fileName)) {
//         window.open(blobUrl, '_blank')
//       } else {
//         const link = document.createElement('a')
//         link.href = blobUrl
//         link.setAttribute('download', fileName)
//         document.body.appendChild(link)
//         link.click()
//         link.remove()
//       }

//       // Очищаем объект URL чтобы не занимать память
//       window.URL.revokeObjectURL(blobUrl)
      
//     } catch (err) {
//       console.error('Download error:', err)
//       setError(err.response?.data?.detail || 'Ошибка при скачивании файла')
//     } finally {
//       setDownloading(false)
//     }
//   }

//   // 🔹 Страница предпросмотра файла
//   if (fileInfo) {
//     const icon = getFileIcon(fileInfo.original_name)
    
//     return (
//       <div className="container">
//         <div className="card" style={{ maxWidth: '500px', margin: '50px auto', padding: '30px' }}>
//           <div style={{ textAlign: 'center', marginBottom: '25px' }}>
//             <div style={{ fontSize: '64px', marginBottom: '15px' }}>{icon}</div>
//             <h3 style={{ margin: '0 0 10px 0', wordBreak: 'break-all' }}>
//               {fileInfo.original_name}
//             </h3>
//             <p style={{ color: '#666', margin: 0 }}>
//               {formatFileSize(fileInfo.size)} • {formatDate(fileInfo.share_token_created)}
//             </p>
//           </div>

//           {error && (
//             <div style={{ 
//               padding: '10px', 
//               backgroundColor: '#f8d7da', 
//               border: '1px solid #f5c6cb',
//               borderRadius: '4px',
//               color: '#721c24',
//               marginBottom: '15px'
//             }}>
//               {error}
//             </div>
//           )}

//           <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
//             <button 
//               className="btn btn-primary" 
//               onClick={handleDownload}
//               disabled={downloading}
//               style={{ padding: '10px 25px', fontSize: '16px' }}
//             >
//               {downloading ? 'Загрузка...' : '⬇️ Скачать файл'}
//             </button>
            
//             {/* Кнопка "Предпросмотр" только для поддерживаемых типов */}
//             {(isPdfFile(fileInfo.original_name) || isImageFile(fileInfo.original_name)) && (
//               <button 
//                 className="btn" 
//                 onClick={handleDownload}
//                 disabled={downloading}
//                 style={{ padding: '10px 25px', fontSize: '16px' }}
//               >
//                 👁️ Открыть
//               </button>
//             )}
//           </div>

//           <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#888' }}>
//             Файл предоставлен пользователем. Будьте осторожны с загрузкой неизвестных файлов.
//           </p>
//         </div>
//       </div>
//     )
//   }

//   // 🔹 Состояние загрузки метаданных
//   if (loading) {
//     return (
//       <div className="container">
//         <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
//           <h2>Проверка ссылки...</h2>
//           <p>Получение информации о файле</p>
//         </div>
//       </div>
//     )
//   }

//   // 🔹 Состояние ошибки
//   if (error) {
//     return (
//       <div className="container">
//         <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
//           <h2 style={{ color: '#dc3545' }}>Ошибка доступа</h2>
//           <p>{error}</p>
//           <button className="btn" onClick={() => window.location.href = '/'}>
//             На главную
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return null
// }

// export default SharedFile
