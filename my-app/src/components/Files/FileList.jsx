import React from 'react'
import FileActions from './FileActions'

const FileList = ({ files, onFileAction, formatDate, formatFileSize }) => {
  if (files.length === 0) {
    return <p>Файлы не найдены</p>
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Имя файла</th>
          <th>Комментарий</th>
          <th>Размер</th>
          <th>Дата загрузки</th>
          <th>Последнее скачивание</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {files.map(file => (
          <tr key={file.id}>
            <td>{file.fileName || file.name}</td>
            <td>{file.comment || '-'}</td>
            <td>{formatFileSize(file.size)}</td>
            <td>{formatDate(file.uploadDate || file.created_at)}</td>
            <td>{formatDate(file.lastDownloadDate || file.last_download)}</td>
            <td>
              <FileActions 
                file={file}
                onFileAction={onFileAction}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default FileList
