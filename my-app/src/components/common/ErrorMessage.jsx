import React, { useEffect } from 'react'

const ErrorMessage = ({ message, onDismiss, autoHide = false }) => {
  if (!message) return null

  useEffect(() => {
    if (autoHide && message && onDismiss) {
      const timer = setTimeout(onDismiss, 5000) // 5 секунд
      return () => clearTimeout(timer)
    }
  }, [message, autoHide, onDismiss])

  return (
    <div 
      className="error-message" 
      role="alert"
      style={{
        marginBottom: '15px',
        padding: '10px 15px',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '4px',
        color: '#721c24',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px'
      }}
    >
      <span>
        <strong>Ошибка:</strong> {message}
      </span>
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
            opacity: 0.7,
            transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '0.7'}
        >
          &times;
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
