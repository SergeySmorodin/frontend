import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { validateRegistrationForm, validateField } from '../../utils/validation'
import Form from '../common/Form'
import InputField from '../common/InputField'

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
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    const fieldError = validateField(name, value, {
      ...formData,
      [name]: value
    })
    
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    const formErrors = validateRegistrationForm(formData)
    setErrors(formErrors)

    if (Object.keys(formErrors).length > 0) {
      return
    }

    setLoading(true)
    const { confirmPassword, ...registrationData } = formData
    const result = await register(registrationData)

    if (result.success) {
      navigate('/login', { 
        state: { message: 'Регистрация успешна! Теперь вы можете войти.' } 
      })
    } else {
      setServerError(result.error)
      setLoading(false)
    }
  }

  return (
    <>
      <Form
        onSubmit={handleSubmit}
        title="Регистрация"
        error={serverError}
        submitText="Зарегистрироваться"
        loading={loading}
      >
        <InputField
          id="login"
          name="login"
          label="Логин"
          value={formData.login}
          onChange={handleChange}
          placeholder="Введите логин"
          error={errors.login}
          required
          autoComplete="username"
        />

        <InputField
          id="fullName"
          name="fullName"
          label="Полное имя"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Введите полное имя"
          error={errors.fullName}
          required
          autoComplete="name"
        />

        <InputField
          id="email"
          name="email"
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Введите email"
          error={errors.email}
          required
          autoComplete="email"
        />

        <InputField
          id="password"
          name="password"
          type="password"
          label="Пароль"
          value={formData.password}
          onChange={handleChange}
          placeholder="Введите пароль"
          error={errors.password}
          required
          autoComplete="new-password"
        />

        <InputField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Подтверждение пароля"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Подтвердите пароль"
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
        />
      </Form>

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </div>
    </>
  )
}

export default Register
