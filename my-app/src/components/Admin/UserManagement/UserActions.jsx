import React from 'react'
import './UserManagement.css';

const UserActions = ({ userId, isCurrentUser, onDelete }) => {
  if (isCurrentUser) return <span className="user-actions-placeholder">—</span>;
  
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
