import React from 'react'
import './UserManagement.css';

const UserManagementHeader = ({ title = 'Управление пользователями', count }) => (
  <div className="user-management-header">
    <h2 className="user-management-title">{title}</h2>
    {count !== undefined && (
      <span className="user-management-badge">
        {count} пользователей
      </span>
    )}
  </div>
)

export default UserManagementHeader
