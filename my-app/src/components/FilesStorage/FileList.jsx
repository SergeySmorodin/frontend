import React from 'react'
import FileActions from './FileActions'
import './FileList.css'

const FileList = ({ files, onFileAction, formatDate, formatFileSize }) => {
  if (files.length === 0) {
    return (
      <div className="file-list-empty">
        <p>Файлы не найдены</p>
      </div>
    )
  }

  return (
    <table className="table file-list-table">
      <thead>
        <tr>
          <th className="col-name">Имя файла</th>
          <th className="col-comment">Комментарий</th>
          <th className="col-size">Размер</th>
          <th className="col-date">Дата загрузки</th>
          <th className="col-download">Последнее скачивание</th>
          <th className="col-status">Статус</th>
          <th className="col-actions">Действия</th>
        </tr>
      </thead>
      <tbody>
        {files.map(file => (
          <tr key={file.id}>
            <td className="col-name file-list-cell-ellipsis" title={file.original_name}>
              {file.original_name}
            </td>
            
            <td className="col-comment file-list-cell-clamp" title={file.comment}>
              {file.comment || '-'}
            </td>
            
            <td className="col-size">{formatFileSize(file.size)}</td>
            <td className="col-date">{formatDate(file.upload_date)}</td>
            <td className="col-download">{formatDate(file.last_download)}</td>
            <td className="col-status">
              {file.share_token ? (
                <span className="file-list-status-shared">🔗 share</span>
              ) : (
                <span className="file-list-status-not-shared">not share</span>
              )}
            </td>
            <td className="col-actions">
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
