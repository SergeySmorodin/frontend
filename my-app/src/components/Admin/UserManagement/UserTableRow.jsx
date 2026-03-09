import React from 'react'
import UserAdminToggle from './UserAdminToggle'
import UserStorageInfo from './UserStorageInfo'
import UserActions from './UserActions'

const UserTableRow = ({ user, currentUser, onToggleAdmin, onDelete }) => {
  const isCurrentUser = user.id === currentUser?.id
  
  return (
    <tr>
      <td>{user.username}</td>
      <td>{user.full_name}</td>
      <td>{user.email}</td>
      <td>
        <UserAdminToggle
          userId={user.id}
          isChecked={user.is_admin}
          isCurrentUser={isCurrentUser}
          onChange={() => onToggleAdmin(user.id, user.is_admin)}
        />
      </td>
      <td>
        <UserStorageInfo 
          storageInfo={user.storage_info} 
          userId={user.id} 
        />
      </td>
      <td>
        <UserActions
          userId={user.id}
          isCurrentUser={isCurrentUser}
          onDelete={() => onDelete(user.id)}
        />
      </td>
    </tr>
  )
}

export default UserTableRow
