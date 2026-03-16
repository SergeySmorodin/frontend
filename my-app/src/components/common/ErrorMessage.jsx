import React, { useEffect } from 'react'
import './ErrorMessage.css'

const ErrorMessage = ({ message, onDismiss, onRetry, autoHide = false }) => {

  useEffect(() => {
    // Автоскрытие работает только если нет кнопки повтора
    if (autoHide && message && onDismiss && !onRetry) {
      const timer = setTimeout(onDismiss, 5000)
      return () => clearTimeout(timer)
    }
  }, [message, autoHide, onDismiss, onRetry])

  if (!message) return null

  return (
    <div className="error-message" role="alert">
      <div className="error-message-content">
        <span className="error-message-icon">⚠️</span>
        <span>
          <strong>Ошибка:</strong> {message}
        </span>
      </div>
      
      <div className="error-message-actions">
        {/* Кнопка Повторить */}
        {onRetry && (
          <button
            type="button"
            className="error-message-retry"
            onClick={onRetry}
          >
            🔄 Повторить
          </button>
        )}

        {/* Кнопка Закрыть */}
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
    </div>
  )
}

export default ErrorMessage
