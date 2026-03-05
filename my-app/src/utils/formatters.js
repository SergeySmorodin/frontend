export const formatDate = (dateString) => {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    // валидация даты
    if (isNaN(date.getTime())) {
      return '-'
    }
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Date formatting error:', error)
    return '-'
  }
}
  
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  