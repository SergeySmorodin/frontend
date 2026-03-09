import React from 'react'
import './RegistrationForm.css'

const RegistrationForm = ({ 
  onSubmit, 
  children, 
  title, 
  error, 
  successMessage,
  submitText = 'Отправить',
  submitClassName = 'btn-success',
  loading = false 
}) => {
  return (
    <div className="card registration-form-card">
      {title && <h2 className="registration-form-title">{title}</h2>}
      
      {successMessage && (
        <div className="registration-form-success">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="registration-form-error">
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      <form onSubmit={onSubmit}>
        {children}
        
        <button 
          type="submit" 
          className={`btn ${submitClassName} registration-form-submit`} 
          disabled={loading}
        >
          {loading ? 'Загрузка...' : submitText}
        </button>
      </form>
    </div>
  )
}

export default RegistrationForm
