import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Home = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="card">
      <h1>Добро пожаловать в облако</h1>
      
      <div style={{ marginTop: '20px' }}>
        <p>
          Приложение позволяет безопасно хранить ваши файлы в облаке и 
          управлять доступом к ним. Основные возможности:
        </p>
        
        <ul style={{ margin: '20px 0 20px 40px' }}>
          <li>Загрузка файлов с комментариями</li>
          <li>Управление файлами (переименование, удаление)</li>
          <li>Просмотр и скачивание файлов</li>
          <li>Создание ссылок для доступа к файлам</li>
          <li>Административный интерфейс для управления пользователями</li>
        </ul>

        {!isAuthenticated && (
          <div style={{ marginTop: '30px' }}>
            <p>Для начала работы необходимо:</p>
            <Link to="/register" className="btn btn-success">
              Зарегистрироваться
            </Link>
            <span style={{ margin: '0 10px' }}>или</span>
            <Link to="/login" className="btn">
              Войти в систему
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
