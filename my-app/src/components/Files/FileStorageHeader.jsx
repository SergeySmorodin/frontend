import React from 'react'
import ErrorMessage from '../common/ErrorMessage'
import './FileStorageHeader.css'

const FileStorageHeader = ({ 
  userName, 
  isCurrentUser, 
  error, 
  onClearError 
}) => {
  return (
    <div className="file-storage-header">
      <h2>
        Управление файлами
        {!isCurrentUser && userName && (
          <span> пользователя {userName}</span>
        )}
      </h2>
      
      <ErrorMessage 
        message={error} 
        onDismiss={onClearError} 
        autoHide={true}
      />
    </div>
  )
}

export default FileStorageHeader
