import React, { useEffect } from 'react'
import './ErrorMessage.css'

const ErrorMessage = ({ message, onDismiss, autoHide = false }) => {
  if (!message) return null

  useEffect(() => {
    if (autoHide && message && onDismiss) {
      const timer = setTimeout(onDismiss, 5000)
      return () => clearTimeout(timer)
    }
  }, [message, autoHide, onDismiss])

  return (
    <div className="error-message" role="alert">
      <span>
        <strong>Ошибка:</strong> {message}
      </span>
      {onDismiss && (
        <button
          type="button"
          className="error-message-dismiss"
          onClick={onDismiss}
          aria-label="Закрыть уведомление"
        >
          &times;
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
