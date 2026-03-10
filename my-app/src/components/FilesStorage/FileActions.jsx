import React from 'react'

const ACTIONS_CONFIG = [
  { 
    id: 'view', icon: '👁️', title: 'Просмотреть', className: 'btn', show: () => true
  },
  { 
    id: 'download', icon: '⬇️', title: 'Скачать', className: 'btn', show: () => true
  },
  { 
    id: 'rename', icon: '✏️', title: 'Переименовать', className: 'btn', show: () => true
  },
  { 
    id: 'share', 
    icon: (file) => file?.share_token ? '🔄' : '🔗',
    title: (file) => file?.share_token ? 'Обновить ссылку' : 'Создать ссылку',
    className: 'btn',
    show: () => true
  },
  { 
    id: 'revoke', icon: '🔒', title: 'Удалить ссылку', className: 'btn',
    show: (file) => !!file?.share_token,
    confirm: true,
    confirmMessage: 'Вы уверены, что хотите удалить ссылку для общего доступа?'
  },
  { 
    id: 'delete', icon: '🗑️', title: 'Удалить', className: 'btn btn-danger',
    show: () => true,
    confirm: true,
    confirmMessage: 'Вы уверены, что хотите удалить файл? Это действие нельзя отменить.'
  },
]

const FileActions = React.memo(({ file, onFileAction }) => {
  
  const handleClick = (action) => {
    if (!file?.id) {
      console.error('Отсутствует файл для действия')
      return
    }

    if (action.confirm) {
      const message = action.confirmMessage || 'Вы уверены?'
      if (!window.confirm(message)) {
        return
      }
    }

    onFileAction(action.id, file)
  }

  return (
    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
      {ACTIONS_CONFIG
        .filter(action => action.show(file))
        .map((action) => (
          <button
            key={action.id}
            onClick={() => handleClick(action)}
            className={action.className}
            title={typeof action.title === 'function' ? action.title(file) : action.title}
            aria-label={typeof action.title === 'function' ? action.title(file) : action.title}
            type="button"
            style={{ margin: '2px' }}
          >
            {typeof action.icon === 'function' ? action.icon(file) : action.icon}
          </button>
      ))}
    </div>
  )
})

export default FileActions
