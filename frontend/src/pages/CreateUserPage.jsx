import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './CreateUserPage.css'

function CreateUserPage({ user }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    role: 'aluno',
    phone: '',
    address: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [createdUser, setCreatedUser] = useState(null)

  const roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'docente', label: 'Professor' },
    { value: 'aluno', label: 'Aluno' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setCreatedUser(null)

    // Validações básicas
    if (!formData.email || !formData.fullName) {
      setError('Email e nome são obrigatórios')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('/api/users', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.success) {
        setSuccess(`Utilizador criado com sucesso! Email enviado para ${response.data.user.email}`)
        setCreatedUser(response.data.user)
        
        // Resetar formulário
        setFormData({
          email: '',
          fullName: '',
          role: 'aluno',
          phone: '',
          address: ''
        })

        // Voltar ao dashboard após 3 segundos
        setTimeout(() => {
          navigate('/dashboard')
        }, 3000)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar utilizador')
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadge = (role) => {
    const roles = {
      'admin': 'Administrador',
      'docente': 'Professor',
      'aluno': 'Aluno'
    }
    return roles[role] || role
  }

  return (
    <div className="create-user-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>🎵 EMMJA - Criar Utilizador</h1>
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            ← Voltar
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container">
        <div className="create-user-card">
          <div className="card-title">➕ Novo Utilizador</div>

          {error && (
            <div className="alert alert-error">{error}</div>
          )}

          {success && (
            <div className="alert alert-success">{success}</div>
          )}

          {createdUser && (
            <div className="success-box">
              <div className="success-header">
                ✅ Utilizador Criado com Sucesso!
              </div>
              <div className="success-content">
                <p><strong>Nome:</strong> {createdUser.fullName}</p>
                <p><strong>Email:</strong> {createdUser.email}</p>
                <p><strong>Função:</strong> <span className={`badge badge-${createdUser.role}`}>{getRoleBadge(createdUser.role)}</span></p>
                <div className="success-message">
                  📧 <strong>Email enviado!</strong> O utilizador receberá as credenciais de acesso no email fornecido com uma password temporária.
                </div>
              </div>
            </div>
          )}

          {!createdUser && (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Nome Completo *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Ex: João Silva"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Ex: joao@escola.pt"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="role">Função *</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    {roles.map(r => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Telefone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Ex: 912345678"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="address">Morada</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Ex: Rua X, nº 10, Lisboa"
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="btn-create"
                disabled={loading}
              >
                {loading ? '⏳ A criar...' : '✨ Criar Utilizador'}
              </button>
            </form>
          )}

          <div className="info-section">
            <h4>ℹ️ O que acontece após criar:</h4>
            <ul>
              <li>✉️ Email automático é enviado com credenciais</li>
              <li>🔐 Password temporária é gerada (12 caracteres aleatórios)</li>
              <li>⚠️ Utilizador deve mudar password no primeiro login</li>
              <li>✅ Conta fica ativa e pronta para usar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateUserPage
