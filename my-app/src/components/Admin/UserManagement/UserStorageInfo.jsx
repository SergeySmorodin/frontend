import React from 'react'
import { Link } from 'react-router-dom'

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

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
