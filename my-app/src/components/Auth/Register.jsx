import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    login: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const validateLogin = (login) => {
    const loginRegex = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/
    return loginRegex.test(login)
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/
    return passwordRegex.test(password)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!validateLogin(formData.login)) {
      newErrors.login = 'Логин должен содержать только латинские буквы и цифры, первый символ - буква, длина от 4 до 20'
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Полное имя обязательно'
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Введите корректный email адрес'
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов, включая заглавную букву, цифру и спецсимвол'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Очищаем ошибку поля при изменении
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    if (!validateForm()) {
      return
    }

    const { confirmPassword, ...registrationData } = formData
    const result = await register(registrationData)

    if (result.success) {
      navigate('/login', { state: { message: 'Регистрация успешна! Теперь вы можете войти.' } })
    } else {
      setServerError(result.error)
      console.error('Ошибка регистрации:', result.error)
    }
  }

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Регистрация</h2>
      
      {serverError && (
        <div className="error-message" style={{ 
          marginBottom: '15px', 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          whiteSpace: 'pre-line'
        }}>
          <strong>Ошибка:</strong> {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login">Логин *</label>
          <input
            type="text"
            id="login"
            name="login"
            value={formData.login}
            onChange={handleChange}
            placeholder="Введите логин"
            required
          />
          {errors.login && <div className="error-message">{errors.login}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="fullName">Полное имя *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Введите полное имя"
            required
          />
          {errors.fullName && <div className="error-message">{errors.fullName}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Введите email"
            required
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите пароль"
            required
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Подтверждение пароля *</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Подтвердите пароль"
            required
          />
          {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
        </div>

        <button type="submit" className="btn btn-success" style={{ width: '100%' }}>
          Зарегистрироваться
        </button>
      </form>

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </div>
    </div>
  )
}

export default Register