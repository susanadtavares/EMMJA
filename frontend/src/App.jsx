import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CreateUserPage from './pages/CreateUserPage'
import ChangePasswordPage from './pages/ChangePasswordPage'
import './App.css'

const DEV_BYPASS_LOGIN = true
const DEV_BYPASS_USER = {
  id: 'dev-user',
  email: 'admin@escola.pt',
  fullName: 'Admin (Bypass)',
  role: 'admin',
  firstLogin: false
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (DEV_BYPASS_LOGIN) {
      setIsAuthenticated(true)
      setUser(DEV_BYPASS_USER)
      setLoading(false)
      return
    }

    // Verificar se existe token no localStorage
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      setIsAuthenticated(true)
      setUser(JSON.parse(savedUser))
    }
    
    setLoading(false)
  }, [])

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setIsAuthenticated(true)
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
  }

  if (loading) {
    return <div className="loading">A carregar...</div>
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            DEV_BYPASS_LOGIN ?
              <Navigate to="/dashboard" /> :
            isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <LoginPage onLogin={handleLogin} />
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
              <DashboardPage user={user} onLogout={handleLogout} /> : 
              <Navigate to="/login" />
          } 
        />
        
        <Route 
          path="/criar-utilizador" 
          element={
            isAuthenticated && user?.role === 'admin' ? 
              <CreateUserPage user={user} /> : 
              <Navigate to="/dashboard" />
          } 
        />

        <Route 
          path="/alterar-password" 
          element={
            isAuthenticated ? 
              <ChangePasswordPage user={user} onLogout={handleLogout} /> : 
              <Navigate to="/login" />
          } 
        />
        
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App
