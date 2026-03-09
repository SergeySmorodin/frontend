import React from 'react'
import './SharedFile.css'

const SharedFileError = ({ message, onReturnHome }) => (
  <div className="shared-file-container">
    <div className="shared-file-card shared-file-error">
      <h2 className="shared-file-error-title">Ошибка доступа</h2>
      <p>{message}</p>
      <button className="shared-file-btn shared-file-btn-secondary" onClick={onReturnHome}>
        На главную
      </button>
    </div>
  </div>
)

export default SharedFileError
