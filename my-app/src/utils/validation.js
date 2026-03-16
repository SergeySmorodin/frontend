import { formatFileSize } from './formatters'

export const REGEX = {
  LOGIN: /^[a-zA-Z][a-zA-Z0-9]{3,19}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/
}

export const ERROR_MESSAGES = {
  // Регистрация
  LOGIN: 'Логин должен содержать только латинские буквы и цифры, первый символ - буква, длина от 4 до 20',
  FULLNAME: 'Полное имя обязательно',
  EMAIL: 'Введите корректный email адрес',
  PASSWORD: 'Пароль должен содержать минимум 6 символов, включая заглавную букву, цифру и спецсимвол',
  PASSWORD_CONFIRM: 'Пароли не совпадают',
  
  // Файлы
  FILE_REQUIRED: 'Выберите файл для загрузки',
  FILE_TOO_LARGE: (maxSize) => `Файл слишком большой. Максимум ${formatFileSize(maxSize)}`,
  FILE_TYPE_NOT_ALLOWED: 'Неподдерживаемый формат файла'
}


export const FILE_VALIDATION = {
  MAX_SIZE: 100 * 1024 * 1024, // 100 MB
  
  // MIME-типы, которые разрешены
  ALLOWED_MIME_TYPES: [
    'text/plain',
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed'
  ],
  
  // Расширения как фолбэк (если MIME-тип не определился)
  ALLOWED_EXTENSIONS: [
    '.txt', '.pdf', '.doc', '.docx',
    '.jpg', '.jpeg', '.png', '.gif',
    '.zip', '.rar', '.7z'
  ]
}

// Валидация файла
export const validateFile = (file, customConfig = {}) => {
  const config = { ...FILE_VALIDATION, ...customConfig }
  
  if (!file) {
    return ERROR_MESSAGES.FILE_REQUIRED
  }

  if (file.size > config.MAX_SIZE) {
    return typeof ERROR_MESSAGES.FILE_TOO_LARGE === 'function'
      ? ERROR_MESSAGES.FILE_TOO_LARGE(config.MAX_SIZE)
      : `Файл слишком большой. Максимум ${formatFileSize(config.MAX_SIZE)}`
  }
  
  // Проверка MIME-типа
  if (config.ALLOWED_MIME_TYPES.length > 0 && !config.ALLOWED_MIME_TYPES.includes(file.type)) {
    // проверяем по расширению, если MIME-тип пустой или неизвестный
    const ext = '.' + file.name.split('.').pop().toLowerCase()
    if (config.ALLOWED_EXTENSIONS.length > 0 && !config.ALLOWED_EXTENSIONS.includes(ext)) {
      return ERROR_MESSAGES.FILE_TYPE_NOT_ALLOWED
    }
    // Если MIME не совпал, но расширение ок — предупреждаем, но не блокируем
    if (file.type && !config.ALLOWED_MIME_TYPES.includes(file.type)) {
      console.warn(`File type "${file.type}" not in allowed list, but extension "${ext}" is allowed`)
    }
  }
  
  return null
}

// Валидация одного поля формы
export const validateField = (name, value, allValues = {}) => {
  switch (name) {
    case 'login':
      return validateLogin(value) ? '' : ERROR_MESSAGES.LOGIN
    case 'fullName':
      return validateFullName(value) ? '' : ERROR_MESSAGES.FULLNAME
    case 'email':
      return validateEmail(value) ? '' : ERROR_MESSAGES.EMAIL
    case 'password':
      return validatePassword(value) ? '' : ERROR_MESSAGES.PASSWORD
    case 'confirmPassword':
      return validatePasswordMatch(allValues.password, value) 
        ? '' 
        : ERROR_MESSAGES.PASSWORD_CONFIRM
    case 'file':
      return validateFile(value) || ''
    default:
      return ''
  }
}


// Регистрация
export const validateRegistrationForm = (formData) => {
  const errors = {}

  if (!validateLogin(formData.login)) {
    errors.login = ERROR_MESSAGES.LOGIN
  }

  if (!validateFullName(formData.fullName)) {
    errors.fullName = ERROR_MESSAGES.FULLNAME
  }

  if (!validateEmail(formData.email)) {
    errors.email = ERROR_MESSAGES.EMAIL
  }

  if (!validatePassword(formData.password)) {
    errors.password = ERROR_MESSAGES.PASSWORD
  }

  if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
    errors.confirmPassword = ERROR_MESSAGES.PASSWORD_CONFIRM
  }

  return errors
}

// Загрузка файла
export const validateUploadForm = (formData) => {
  const errors = {}
  
  const fileError = validateFile(formData.file)
  if (fileError) {
    errors.file = fileError
  }
  
  if (formData.comment && formData.comment.length > 500) {
    errors.comment = 'Комментарий не должен превышать 500 символов'
  }
  
  return errors
}


export const validateLogin = (login) => REGEX.LOGIN.test(login)
export const validateEmail = (email) => REGEX.EMAIL.test(email)
export const validatePassword = (password) => REGEX.PASSWORD.test(password)
export const validateFullName = (fullName) => fullName && fullName.trim().length > 0
export const validatePasswordMatch = (password, confirmPassword) => password === confirmPassword
