import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Облачное хранилище
        </Link>
        
        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin/users" className="navbar-link">
                  Управление пользователями
                </Link>
              )}
              <Link to={`/storage/${user?.id}`} className="navbar-link">
                Мои файлы
              </Link>
              <span className="navbar-user">
                {user?.username}
              </span>
              <button onClick={handleLogout} className="btn">
                Выход
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">
                Вход
              </Link>
              <Link to="/register" className="btn btn-success">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
