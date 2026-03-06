import React from 'react'
import { getFileIcon } from '../../utils/fileHelpers'
import { formatFileSize, formatDate } from '../../utils/formatters'

const SharedFileHeader = ({ fileName, fileSize, fileDate }) => {
  const icon = getFileIcon(fileName)
  
  return (
    <div style={{ textAlign: 'center', marginBottom: '25px' }}>
      <div style={{ fontSize: '64px', marginBottom: '15px', userSelect: 'none' }}>
        {icon}
      </div>
      <h3 style={{ margin: '0 0 10px 0', wordBreak: 'break-all' }}>
        {fileName}
      </h3>
      <p style={{ color: '#666', margin: 0 }}>
        {formatFileSize(fileSize)} • {formatDate(fileDate)}
      </p>
    </div>
  )
}

export default SharedFileHeader
