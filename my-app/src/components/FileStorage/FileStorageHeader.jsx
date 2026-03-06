import React from 'react'
import ErrorMessage from '../common/ErrorMessage'

const FileStorageHeader = ({ 
  userName, 
  isCurrentUser, 
  error, 
  onClearError 
}) => {
  return (
    <>
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
    </>
  )
}

export default FileStorageHeader
