// Регулярные выражения для валидации
export const REGEX = {
    LOGIN: /^[a-zA-Z][a-zA-Z0-9]{3,19}$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/
  }
  
  // Сообщения об ошибках
  export const ERROR_MESSAGES = {
    LOGIN: 'Логин должен содержать только латинские буквы и цифры, первый символ - буква, длина от 4 до 20',
    FULLNAME: 'Полное имя обязательно',
    EMAIL: 'Введите корректный email адрес',
    PASSWORD: 'Пароль должен содержать минимум 6 символов, включая заглавную букву, цифру и спецсимвол',
    PASSWORD_CONFIRM: 'Пароли не совпадают'
  }
  
  // Функции валидации
  export const validateLogin = (login) => {
    return REGEX.LOGIN.test(login)
  }
  
  export const validateEmail = (email) => {
    return REGEX.EMAIL.test(email)
  }
  
  export const validatePassword = (password) => {
    return REGEX.PASSWORD.test(password)
  }
  
  export const validateFullName = (fullName) => {
    return fullName && fullName.trim().length > 0
  }
  
  export const validatePasswordMatch = (password, confirmPassword) => {
    return password === confirmPassword
  }
  
  // Основная функция валидации всей формы
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
  
  // Валидация одного поля (для onChange)
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
      default:
        return ''
    }
  }
