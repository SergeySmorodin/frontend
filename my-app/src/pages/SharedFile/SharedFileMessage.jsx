import React from 'react'
import './SharedFile.css'

const SharedFileMessage = ({ message, onDismiss }) => {
  if (!message) return null
  
  return (
    <div className="shared-file-alert">
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Закрыть уведомление"
          className="shared-file-alert-close"
        >
          &times;
        </button>
      )}
    </div>
  )
}

export default SharedFileMessage
