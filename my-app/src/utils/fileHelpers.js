const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'])
const PDF_EXTENSIONS = new Set(['pdf'])
const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'avi', 'mov', 'wmv', 'flv', 'mkv'])
const AUDIO_EXTENSIONS = new Set(['mp3', 'wav', 'ogg', 'm4a', 'flac'])
const DOCUMENT_EXTENSIONS = new Set(['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'])

// Маппинг расширений в MIME-типы
const CONTENT_TYPE_MAP = {
  // Изображения
  'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png',
  'gif': 'image/gif', 'bmp': 'image/bmp', 'webp': 'image/webp',
  'svg': 'image/svg+xml', 'ico': 'image/x-icon',
  // Документы
  'pdf': 'application/pdf', 'txt': 'text/plain',
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
  'zip': 'application/zip', 'rar': 'application/x-rar-compressed',
  '7z': 'application/x-7z-compressed', 'tar': 'application/x-tar',
  'gz': 'application/gzip',
  // Видео
  'mp4': 'video/mp4', 'webm': 'video/webm', 'avi': 'video/x-msvideo',
  'mov': 'video/quicktime', 'wmv': 'video/x-ms-wmv',
  'flv': 'video/x-flv', 'mkv': 'video/x-matroska',
  // Аудио
  'mp3': 'audio/mpeg', 'wav': 'audio/wav', 'ogg': 'audio/ogg',
  'm4a': 'audio/mp4', 'flac': 'audio/flac',
  // Веб
  'html': 'text/html', 'htm': 'text/html', 'css': 'text/css',
  'js': 'application/javascript', 'json': 'application/json',
  'xml': 'application/xml',
  // Другое
  'csv': 'text/csv', 'rtf': 'application/rtf',
  'epub': 'application/epub+zip'
}


const getFileExtension = (fileName) => {
  if (!fileName) return ''
  return fileName.split('.').pop().toLowerCase()
}

export const getContentTypeFromFileName = (fileName) => {
  const ext = getFileExtension(fileName)
  return CONTENT_TYPE_MAP[ext] || 'application/octet-stream'
}

export const isImageFile = (fileName) => {
  const ext = getFileExtension(fileName)
  return IMAGE_EXTENSIONS.has(ext)
}

export const isPdfFile = (fileName) => {
  const ext = getFileExtension(fileName)
  return PDF_EXTENSIONS.has(ext)
}

export const isVideoFile = (fileName) => {
  const ext = getFileExtension(fileName)
  return VIDEO_EXTENSIONS.has(ext)
}

export const isAudioFile = (fileName) => {
  const ext = getFileExtension(fileName)
  return AUDIO_EXTENSIONS.has(ext)
}

export const isDocumentFile = (fileName) => {
  const ext = getFileExtension(fileName)
  return DOCUMENT_EXTENSIONS.has(ext)
}

export const getFileIcon = (fileName) => {
  if (isImageFile(fileName)) return '🖼️'
  if (isPdfFile(fileName)) return '📄'
  if (isVideoFile(fileName)) return '🎬'
  if (isAudioFile(fileName)) return '🎵'
  if (isDocumentFile(fileName)) return '📝'
  return '📁'
}
