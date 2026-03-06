import React from 'react'

const UserManagementHeader = ({ title = 'Управление пользователями', count }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {count !== undefined && (
      <span className="badge" style={{ 
        backgroundColor: '#6c757d', 
        padding: '4px 12px', 
        borderRadius: '12px',
        fontSize: '14px'
      }}>
        {count} пользователей
      </span>
    )}
  </div>
)

export default UserManagementHeader
