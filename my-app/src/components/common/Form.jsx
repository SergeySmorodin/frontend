import React from 'react'

const Form = ({ 
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
    <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
      {title && <h2>{title}</h2>}
      
      {successMessage && (
        <div style={{ 
          color: '#28a745', 
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px'
        }}>
          {successMessage}
        </div>
      )}

      {error && (
        <div className="error-message" style={{ 
          marginBottom: '15px', 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          whiteSpace: 'pre-line'
        }}>
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      <form onSubmit={onSubmit}>
        {children}
        
        <button 
          type="submit" 
          className={`btn ${submitClassName}`} 
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? 'Загрузка...' : submitText}
        </button>
      </form>
    </div>
  )
}

export default Form
