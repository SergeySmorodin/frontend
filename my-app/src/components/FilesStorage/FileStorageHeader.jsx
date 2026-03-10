import React from 'react'
import ErrorMessage from '../common/ErrorMessage'
import './FileStorageHeader.css'

const FileStorageHeader = ({ 
  userName, 
  isCurrentUser, 
  isAdminView,
  error, 
  onClearError 
}) => {
  return (
    <div className="file-storage-header">
      <h2>
        {isAdminView 
          ? 'Управление файлами пользователей' 
          : 'Управление файлами'
        }
        {!isAdminView && userName && !isCurrentUser && (
          <span className="owner-name"> пользователя {userName}</span>
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
