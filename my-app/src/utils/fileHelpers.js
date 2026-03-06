// Маппинг расширений файлов в MIME-типы
export const getContentTypeFromFileName = (fileName) => {
    if (!fileName) return 'application/octet-stream'
    
    const extension = fileName.split('.').pop().toLowerCase()
    
    const contentTypeMap = {
      // Изображения
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'bmp': 'image/bmp',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'ico': 'image/x-icon',
      
      // Документы
      'pdf': 'application/pdf',
      'txt': 'text/plain',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'odt': 'application/vnd.oasis.opendocument.text',
      'ods': 'application/vnd.oasis.opendocument.spreadsheet',
      'odp': 'application/vnd.oasis.opendocument.presentation',
      
      // Архивы
      'zip': 'application/zip',
      'rar': 'application/x-rar-compressed',
      '7z': 'application/x-7z-compressed',
      'tar': 'application/x-tar',
      'gz': 'application/gzip',
      
      // Видео
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'avi': 'video/x-msvideo',
      'mov': 'video/quicktime',
      'wmv': 'video/x-ms-wmv',
      'flv': 'video/x-flv',
      'mkv': 'video/x-matroska',
      
      // Аудио
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'm4a': 'audio/mp4',
      'flac': 'audio/flac',
      
      // Веб
      'html': 'text/html',
      'htm': 'text/html',
      'css': 'text/css',
      'js': 'application/javascript',
      'json': 'application/json',
      'xml': 'application/xml',
      
      // Другое
      'csv': 'text/csv',
      'rtf': 'application/rtf',
      'epub': 'application/epub+zip'
    }
    
    return contentTypeMap[extension] || 'application/octet-stream'
  }
  
  // Проверка, является ли файл изображением
  export const isImageFile = (fileName) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico']
    const extension = fileName?.split('.').pop().toLowerCase()
    return imageExtensions.includes(extension)
  }
  
  // Проверка, является ли файл PDF
  export const isPdfFile = (fileName) => {
    const extension = fileName?.split('.').pop().toLowerCase()
    return extension === 'pdf'
  }
  
  // Проверка, является ли файл видео
  export const isVideoFile = (fileName) => {
    const videoExtensions = ['mp4', 'webm', 'avi', 'mov', 'wmv', 'flv', 'mkv']
    const extension = fileName?.split('.').pop().toLowerCase()
    return videoExtensions.includes(extension)
  }
  
  // Проверка, является ли файл аудио
  export const isAudioFile = (fileName) => {
    const audioExtensions = ['mp3', 'wav', 'ogg', 'm4a', 'flac']
    const extension = fileName?.split('.').pop().toLowerCase()
    return audioExtensions.includes(extension)
  }
  
  // Проверка, является ли файл документом
  export const isDocumentFile = (fileName) => {
    const docExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt']
    const extension = fileName?.split('.').pop().toLowerCase()
    return docExtensions.includes(extension)
  }
  
  // Получение иконки для файла по расширению
  export const getFileIcon = (fileName) => {
    if (isImageFile(fileName)) return '🖼️'
    if (isPdfFile(fileName)) return '📄'
    if (isVideoFile(fileName)) return '🎬'
    if (isAudioFile(fileName)) return '🎵'
    if (isDocumentFile(fileName)) return '📝'
    return '📁'
  }
