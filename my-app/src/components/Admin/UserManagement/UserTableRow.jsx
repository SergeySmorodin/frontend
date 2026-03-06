import React from 'react'
import UserAdminToggle from './UserAdminToggle'
import UserStorageInfo from './UserStorageInfo'
import UserActions from './UserActions'

const UserTableRow = ({ user, currentUser, onToggleAdmin, onDelete }) => {
  const isCurrentUser = user.id === currentUser?.id
  
  return (
    <tr>
      <td>{user.login}</td>
      <td>{user.fullName}</td>
      <td>{user.email}</td>
      <td>
        <UserAdminToggle
          userId={user.id}
          isChecked={user.isAdmin}
          isCurrentUser={isCurrentUser}
          onChange={() => onToggleAdmin(user.id, user.isAdmin)}
        />
      </td>
      <td>
        <UserStorageInfo 
          storageInfo={user.storageInfo} 
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
