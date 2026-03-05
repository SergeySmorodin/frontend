import React, { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import RegistrationForm from '../common/RegistrationForm'
import InputField from '../common/InputField'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const successMessage = location.state?.message || ''

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(formData.login, formData.password)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <>
      <RegistrationForm
        onSubmit={handleSubmit}
        title="Вход в систему"
        error={error}
        successMessage={successMessage}
        submitText="Войти"
        submitClassName="btn"
        loading={loading}
      >
        <InputField
          id="login"
          name="login"
          label="Логин"
          value={formData.login}
          onChange={handleChange}
          placeholder="Введите логин"
          required
          autoComplete="username"
        />

        <InputField
          id="password"
          name="password"
          type="password"
          label="Пароль"
          value={formData.password}
          onChange={handleChange}
          placeholder="Введите пароль"
          required
          autoComplete="current-password"
        />
      </RegistrationForm>

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </div>
    </>
  )
}

export default Login
