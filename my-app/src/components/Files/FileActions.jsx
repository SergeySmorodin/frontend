import React from 'react'

const ACTIONS_CONFIG = [
  { id: 'view', icon: '👁️', title: 'Просмотреть', className: 'btn' },
  { id: 'download', icon: '⬇️', title: 'Скачать', className: 'btn' },
  { id: 'rename', icon: '✏️', title: 'Переименовать', className: 'btn' },
  { id: 'share', icon: '🔗', title: 'Создать ссылку', className: 'btn' },
  { id: 'revoke', icon: '🔒', title: 'Удалить ссылку', className: 'btn' },
  { id: 'delete', icon: '🗑️', title: 'Удалить', className: 'btn btn-danger', confirm: true },
]

const FileActions = React.memo(({ file, onFileAction }) => {
  
  const handleClick = (actionId) => {
    // Базовая валидация
    if (!file?.id) return

    // Подтверждение для опасных действий
    const action = ACTIONS_CONFIG.find(a => a.id === actionId)
    if (action?.confirm && !window.confirm('Вы уверены, что хотите выполнить это действие?')) {
      return
    }

    onFileAction(actionId, file)
  }

  return (
    <>
      {ACTIONS_CONFIG.map((action) => (
        <button
          key={action.id}
          onClick={() => handleClick(action.id)}
          className={action.className}
          title={action.title}
          aria-label={action.title}
          type="button"
        >
          {action.icon}
        </button>
      ))}
    </>
  )
})

export default FileActions
