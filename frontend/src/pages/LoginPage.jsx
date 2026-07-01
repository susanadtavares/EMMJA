import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import schoolLogo from '../assets/Logótipo.jpg'
import schoolBuilding from '../assets/bandasede2023.jpg'
import './LoginPage.css'

function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('/api/auth/login', { email, password })

      if (response.data.success) {
        onLogin(response.data.token, response.data.user)
        navigate(response.data.firstLogin ? '/alterar-password' : '/dashboard')
      } else {
        setError(response.data.error || 'Não foi possível entrar')
      }
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Erro de conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-container">
      <section className="login-brand" aria-label="Escola de Música">
        <img
          className="login-brand-image"
          src={schoolBuilding}
          alt="Sede da Banda Musical Flor da Mocidade Junqueirense"
        />
        <div className="login-brand-overlay" aria-hidden="true" />
        <div className="login-brand-content">
          <span className="login-eyebrow">Área reservada</span>
          <span className="login-brand-line" aria-hidden="true" />
        </div>
      </section>

      <section className="login-card" aria-label="Iniciar sessão">
        <div className="login-logo-frame">
          <img
            className="login-logo"
            src={schoolLogo}
            alt="Escola de Música Manuel Joaquim de Almeida"
          />
        </div>
        <form onSubmit={handleLogin}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Palavra-passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner" /> A entrar...
              </>
            ) : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
