import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import './DashboardPage.css'

function DashboardPage({ user, onLogout }) {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers()
    }
  }, [user])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setUsers([])
        return
      }

      const response = await axios.get('/api/users?limit=10', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.success) {
        setUsers(response.data.users)
      }
    } catch (err) {
      setError('Erro ao carregar utilizadores')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    onLogout()
    navigate('/login')
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
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>🎵 EMMJA Dashboard</h1>
          <div className="header-nav">
            {user?.role === 'admin' && (
              <Link to="/criar-utilizador" className="btn-header">
                ➕ Criar Utilizador
              </Link>
            )}
            <Link to="/alterar-password" className="btn-header">
              🔑 Alterar Password
            </Link>
            <button className="btn-logout" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container">
        {/* Welcome Card */}
        <div className="card">
          <div className="card-title">👋 Bem-vindo!</div>
          <div className="user-info">
            <p><strong>Nome:</strong> {user?.fullName}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Função:</strong> <span className={`badge badge-${user?.role}`}>{getRoleBadge(user?.role)}</span></p>
          </div>
        </div>

        {/* Admin Section */}
        {user?.role === 'admin' && (
          <>
            <div className="card">
              <div className="card-title">📋 Utilizadores do Sistema</div>
              
              {error && (
                <div className="alert alert-error">{error}</div>
              )}

              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <span className="loading-spinner"></span> A carregar...
                </div>
              ) : users.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Função</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td><strong>{u.fullName}</strong></td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`badge badge-${u.role}`}>
                            {getRoleBadge(u.role)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${u.isActive ? 'badge-active' : 'badge-inactive'}`}>
                            {u.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-warning" title="Resend credentials">
                              📧 Email
                            </button>
                            {u.id !== user?.id && (
                              <button className="btn-danger" title="Desativar">
                                🗑️ Desativar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                  Nenhum utilizador encontrado
                </p>
              )}
            </div>

            {/* Stats Card */}
            <div className="card">
              <div className="card-title">📊 Estatísticas</div>
              <div className="grid-2">
                <div className="stat-box">
                  <div className="stat-number">{users.length}</div>
                  <div className="stat-label">Utilizadores Totais</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">
                    {users.filter(u => u.isActive).length}
                  </div>
                  <div className="stat-label">Utilizadores Ativos</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Teacher Section */}
        {user?.role === 'docente' && (
          <div className="card">
            <div className="card-title">📚 Minhas Aulas</div>
            <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
              Funcionalidade em desenvolvimento...
            </p>
          </div>
        )}

        {/* Student Section */}
        {user?.role === 'aluno' && (
          <div className="card">
            <div className="card-title">🎓 Minhas Inscrições</div>
            <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
              Funcionalidade em desenvolvimento...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
