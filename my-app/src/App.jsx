import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout/Layout'
import Home from './pages/Home/index'
import Register from './components/Auth/Register'
import Login from './components/Auth/Login'
import UserManagement from './pages/Admin/index'
import FileStorage from './pages/FileStorage/index'
import SharedFile from './pages/SharedFile/index'
import AppInitializer from './components/common/AppInitializer'


function AppContent() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/storage/:userId?" element={<FileStorage />} />
        <Route path="/api/storage/share/:shareToken/" element={<SharedFile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppInitializer>
          <AppContent />
        </AppInitializer>
      </Router>
    </AuthProvider>
  )
}

export default App
