import React from 'react'
import { isImageFile, isPdfFile } from '../../utils/fileHelpers'

const SharedFileActions = ({ 
  fileName, 
  onDownload, 
  onPreview, 
  disabled 
}) => {
  const showPreview = isPdfFile(fileName) || isImageFile(fileName)
  
  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
      <button 
        className="btn btn-primary" 
        onClick={onDownload}
        disabled={disabled}
        style={{ padding: '10px 25px', fontSize: '16px' }}
      >
        {disabled ? 'Загрузка...' : '⬇️ Скачать файл'}
      </button>
      
      {showPreview && (
        <button 
          className="btn" 
          onClick={onPreview}
          disabled={disabled}
          style={{ padding: '10px 25px', fontSize: '16px' }}
        >
          👁️ Открыть
        </button>
      )}
    </div>
  )
}

export default SharedFileActions
