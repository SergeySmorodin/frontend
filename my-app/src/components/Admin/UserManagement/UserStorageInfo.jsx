import React from 'react'
import { Link } from 'react-router-dom'
import { formatFileSize } from '../../../utils/formatters'

const UserStorageInfo = ({ storageInfo, userId }) => {
  if (!storageInfo) return <span>—</span>
  
  return (
    <>
      <div>Файлов: {storageInfo.file_count}</div>
      <div>Размер: {formatFileSize(storageInfo.total_size)}</div>
      <Link 
        to={`/storage/${userId}`} 
        className="btn btn-success btn-sm" 
        style={{ marginTop: '5px' }}
      >
        Управлять
      </Link>
    </>
  )
}

export default UserStorageInfo
