import React from 'react'

const SharedFileError = ({ message, onReturnHome }) => (
  <div className="container">
    <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
      <h2 style={{ color: '#dc3545' }}>Ошибка доступа</h2>
      <p>{message}</p>
      <button className="btn" onClick={onReturnHome}>
        На главную
      </button>
    </div>
  </div>
)

export default SharedFileError
