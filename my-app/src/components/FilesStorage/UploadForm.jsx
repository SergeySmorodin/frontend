import React from 'react'
import './UploadForm.css'

const UploadForm = ({
  onSubmit,
  onFileSelect,
  onClearSelected,
  comment,
  onCommentChange,
  selectedFile,
  uploading,
  formatFileSize
}) => {
  return (
    <form onSubmit={onSubmit} className="upload-form">
      <div className="form-group">
        <input
          type="file"
          id="file"
          onChange={onFileSelect}
          disabled={uploading}
        />
        {selectedFile && (
          <div className="upload-form-file-info">
            <span>
              <strong>Выбран файл:</strong> {selectedFile.name} 
              ({formatFileSize(selectedFile.size)})
            </span>
            <button 
              type="button" 
              onClick={onClearSelected}
              className="upload-form-clear-btn"
              aria-label="Очистить выбранный файл"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="comment">Комментарий к файлу</label>
        <input
          type="text"
          id="comment"
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Введите комментарий"
          disabled={uploading}
        />
      </div>

      <button 
        type="submit" 
        className="btn btn-success upload-form-submit-btn"
        disabled={uploading || !selectedFile}
      >
        {uploading ? 'Загрузка...' : 'Загрузить'}
      </button>
    </form>
  )
}

export default UploadForm
