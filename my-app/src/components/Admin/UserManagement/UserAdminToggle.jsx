import React from 'react'

const UserAdminToggle = ({ userId, isChecked, onChange, isCurrentUser, disabled }) => (
  <input
    type="checkbox"
    checked={isChecked}
    onChange={onChange}
    disabled={disabled || isCurrentUser}
    title={isCurrentUser ? 'Нельзя изменить свои права' : ''}
    aria-label={`Переключить роль администратора для пользователя ${userId}`}
    style={{ cursor: (disabled || isCurrentUser) ? 'not-allowed' : 'pointer' }}
  />
)

export default UserAdminToggle
