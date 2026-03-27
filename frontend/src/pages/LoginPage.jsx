import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './LoginPage.css'

function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      })

      if (response.data.success) {
        onLogin(response.data.token, response.data.user)
        
        // Se firstLogin = true, redirecionar para mudar password
        if (response.data.firstLogin) {
          navigate('/alterar-password')
        } else {
          navigate('/dashboard')
        }
      } else {
        setError(response.data.error || 'Erro ao fazer login')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro de conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🎵 EMMJA</h1>
          <p>Escola de Música</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu-email@escola.pt"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua password"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-login"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span> A conectar...
              </>
            ) : (
              'Fazer Login'
            )}
          </button>
        </form>

        <div className="login-info">
          <p><strong>Credenciais de teste:</strong></p>
          <p>Email: <code>admin@escola.pt</code></p>
          <p>Password: <code>senha123</code></p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
