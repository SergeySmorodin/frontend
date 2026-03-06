import React from 'react'
import UserTableRow from './UserTableRow'

const UserManagementTable = ({ 
  users, 
  currentUser, 
  onToggleAdmin, 
  onDelete 
}) => {
  if (!users?.length) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
        <p>Пользователи не найдены</p>
      </div>
    )
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Логин</th>
            <th>Полное имя</th>
            <th>Email</th>
            <th>Администратор</th>
            <th>Файлы</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <UserTableRow
              key={user.id}
              user={user}
              currentUser={currentUser}
              onToggleAdmin={onToggleAdmin}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserManagementTable
