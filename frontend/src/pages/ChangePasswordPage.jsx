import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './ChangePasswordPage.css'

function ChangePasswordPage({ user, onLogout }) {
  const navigate = useNavigate()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('As passwords não coincidem')
      return
    }

    if (newPassword.length < 6) {
      setError('Password deve ter no mínimo 6 caracteres')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('/api/auth/change-password', {
        oldPassword,
        newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.success) {
        setSuccess('Password alterada com sucesso!')
        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao alterar password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <div className="warning-banner">
          ⚠️ Primeiro Login - Altere a sua password
        </div>

        <h2>Atualizar Password</h2>
        <p className="subtitle">
          Bem-vindo, <strong>{user?.fullName}</strong>! Esta é a sua primeira entrada no sistema.
        </p>

        <form onSubmit={handleChangePassword}>
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="oldPassword">Password Atual (Temporária)</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Password temporária que recebeu"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Nova Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme a nova password"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-change-password"
            disabled={loading}
          >
            {loading ? 'A atualizar...' : 'Atualizar Password'}
          </button>
        </form>

        <div className="info-box">
          <p>
            <strong>ℹ️ Dica:</strong> Escolha uma password segura com pelo menos 8 caracteres, 
            incluindo letras maiúsculas, minúsculas, números e símbolos.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordPage
