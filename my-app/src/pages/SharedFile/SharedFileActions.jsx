import React from 'react'
import { isImageFile, isPdfFile } from '../../utils/fileHelpers'
import './SharedFile.css'

const SharedFileActions = ({ 
  fileName, 
  onDownload, 
  onPreview, 
  disabled 
}) => {
  const showPreview = isPdfFile(fileName) || isImageFile(fileName)
  
  return (
    <div className="shared-file-actions">
      <button 
        className="shared-file-btn shared-file-btn-primary" 
        onClick={onDownload}
        disabled={disabled}
      >
        {disabled ? 'Загрузка...' : '⬇️ Скачать файл'}
      </button>
      
      {showPreview && (
        <button 
          className="shared-file-btn shared-file-btn-secondary" 
          onClick={onPreview}
          disabled={disabled}
        >
          👁️ Открыть
        </button>
      )}
    </div>
  )
}

export default SharedFileActions

