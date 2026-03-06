import React from 'react'
import { Link } from 'react-router-dom'
import { formatFileSize } from '../../../utils/formatters'

const UserStorageInfo = ({ storageInfo, userId }) => {
  if (!storageInfo) return <span>—</span>
  
  return (
    <>
      <div>Файлов: {storageInfo.fileCount}</div>
      <div>Размер: {formatFileSize(storageInfo.totalSize)}</div>
      <Link to={`/storage/${userId}`} className="btn btn-success btn-sm" style={{ marginTop: '5px' }}>
        Управлять
      </Link>
    </>
  )
}

export default UserStorageInfo
