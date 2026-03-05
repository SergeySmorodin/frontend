import React from 'react'

const UploadForm = ({
  onSubmit,
  onFileSelect,
  onClearSelected,
  comment,
  onCommentChange,
  selectedFile,
  uploading,
  error,
  formatFileSize
}) => {
  return (
    <form onSubmit={onSubmit} style={{ marginBottom: '30px' }}>
      <h3>Загрузить новый файл</h3>
      
      <div className="form-group">
        <label htmlFor="file">Выберите файл</label>
        <input
          type="file"
          id="file"
          onChange={onFileSelect}
          disabled={uploading}
        />
        {selectedFile && (
          <div style={{ 
            marginTop: '5px', 
            padding: '5px', 
            backgroundColor: '#e9ecef',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            <strong>Выбран файл:</strong> {selectedFile.name} 
            ({formatFileSize(selectedFile.size)})
            <button 
              type="button" 
              onClick={onClearSelected}
              style={{ 
                marginLeft: '10px',
                padding: '2px 5px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
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
        className="btn btn-success"
        disabled={uploading || !selectedFile}
      >
        {uploading ? 'Загрузка...' : 'Загрузить'}
      </button>
    </form>
  )
}

export default UploadForm
