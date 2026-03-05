import React from 'react'

const FileActions = ({ file, onFileAction }) => {
  return (
    <>
      <button
        onClick={() => onFileAction('download', file.id, file.original_name)}
        className="btn"
        title="Скачать"
      >
        ⬇️
      </button>
      <button
        onClick={() => onFileAction('view', file.id)}
        className="btn"
        title="Просмотреть"
      >
        👁️
      </button>
      <button
        onClick={() => onFileAction('rename', file.id, file.original_name)}
        className="btn"
        title="Переименовать"
      >
        ✏️
      </button>
      <button
        onClick={() => onFileAction('share', file.id)}
        className="btn"
        title="Создать ссылку"
      >
        🔗
      </button>
      <button
        onClick={() => onFileAction('revoke', file.id)}
        className="btn"
        title="Удалить ссылку"
      >
        🔒
      </button>
      <button
        onClick={() => onFileAction('delete', file.id)}
        className="btn btn-danger"
        title="Удалить"
      >
        🗑️
      </button>
    </>
  )
}

export default FileActions
