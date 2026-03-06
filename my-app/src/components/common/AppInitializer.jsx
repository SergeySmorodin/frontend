import React from 'react'
import { useAuth } from '../../context/AuthContext'

export function AppInitializer({ children }) {
  const { loading } = useAuth()
  
  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Загрузка...</h2>
        </div>
      </div>
    )
  }
  
  return children
}

export default AppInitializer
