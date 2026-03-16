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
  formatFileSize,
  fileInputRef,
  error
}) => {
  return (
    <form onSubmit={onSubmit} className="upload-form" noValidate>
      {error && (
        <div className="upload-form-error" role="alert">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="file" className="upload-form-label">
          Выберите файл
        </label>
        
        <input
          type="file"
          id="file"
          name="file"
          onChange={onFileSelect}
          disabled={uploading}
          ref={fileInputRef}
          aria-describedby={error ? 'file-error' : undefined}
          className="upload-form-file-input"
        />
        
        {selectedFile && (
          <div className="upload-form-file-info" role="status">
            <span>
              <strong>Выбран файл:</strong> {selectedFile.name} 
              ({formatFileSize(selectedFile.size)})
            </span>
            <button 
              type="button" 
              onClick={onClearSelected}
              className="upload-form-clear-btn"
              aria-label="Очистить выбранный файл"
              disabled={uploading}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="comment" className="upload-form-label">
          Комментарий к файлу
        </label>
        <input
          type="text"
          id="comment"
          name="comment"
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Введите комментарий"
          disabled={uploading}
          maxLength={500}
          className="upload-form-comment-input"
        />
      </div>

      <button 
        type="submit" 
        className="btn btn-success upload-form-submit-btn"
        disabled={uploading || !selectedFile}
        aria-busy={uploading}
      >
        {uploading ? (
          <>
            <span className="upload-form-spinner" aria-hidden="true">⏳</span>
            Загрузка...
          </>
        ) : 'Загрузить'}
      </button>
    </form>
  )
}

export default UploadForm
