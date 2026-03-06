import React from 'react'

const SharedFileMessage = ({ message, onDismiss }) => {
  if (!message) return null
  
  return (
    <div style={{ 
      padding: '10px 15px', 
      backgroundColor: '#f8d7da', 
      border: '1px solid #f5c6cb',
      borderRadius: '4px',
      color: '#721c24',
      marginBottom: '15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '10px'
    }}>
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Закрыть уведомление"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            lineHeight: '1',
            padding: '0 4px',
            color: '#721c24',
            opacity: 0.7
          }}
        >
          &times;
        </button>
      )}
    </div>
  )
}

export default SharedFileMessage
