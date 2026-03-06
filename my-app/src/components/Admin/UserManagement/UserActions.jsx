import React from 'react'

const UserActions = ({ userId, isCurrentUser, onDelete }) => {
  if (isCurrentUser) return <span style={{ color: '#6c757d' }}>—</span>
  
  return (
    <button
      onClick={onDelete}
      className="btn btn-danger btn-sm"
      aria-label={`Удалить пользователя ${userId}`}
    >
      Удалить
    </button>
  )
}

export default UserActions
