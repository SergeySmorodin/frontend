import React from 'react'
import { getFileIcon } from '../../utils/fileHelpers'
import { formatFileSize, formatDate } from '../../utils/formatters'
import './SharedFile.css'

const SharedFileHeader = ({ fileName, fileSize, fileDate }) => {
  const icon = getFileIcon(fileName)
  
  return (
    <div className="shared-file-header">
      <div className="shared-file-icon">
        {icon}
      </div>
      <h3 className="shared-file-name">
        {fileName}
      </h3>
      <p className="shared-file-meta">
        {formatFileSize(fileSize)} • {formatDate(fileDate)}
      </p>
    </div>
  )
}

export default SharedFileHeader
