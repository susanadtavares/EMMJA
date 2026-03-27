# 📐 Arquitetura do Projeto EMMJA

## Frontend-Backend Communication

```
┌────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                          │
│              http://localhost:3000                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Pages:                                                   │  │
│  │ - LoginPage (primeiro login + change password)          │  │
│  │ - Dashboard (Admin, Docente, Aluno)                    │  │
│  │ - ClassesPage (ver/gerir aulas)                        │  │
│  │ - PaymentsPage (ver/registar pagamentos)               │  │
│  │ - EventsPage (ver/confirmar eventos)                   │  │
│  │ - ProfilePage (editar perfil)                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────┬──────────────────────────────────────────┘
                      │ AXIOS HTTP Requests
                      │ (com JWT Token)
                      │
┌─────────────────────▼──────────────────────────────────────────┐
│                    BACKEND (Express)                           │
│              http://localhost:5000                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                ROUTES (api/)                            │  │
│  │  POST   /api/auth/login                                │  │
│  │  POST   /api/auth/change-password                       │  │
│  │  GET    /api/users/:id                                 │  │
│  │  PUT    /api/users/:id                                 │  │
│  │  GET    /api/classes                                   │  │
│  │  POST   /api/payments                                  │  │
│  │  GET    /api/payments/user/:id                         │  │
│  │  GET    /api/salaries/teacher/:id                      │  │
│  │  POST   /api/events/:id/rsvp                           │  │
│  │  ...mais rotas...                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                    ▲                                            │
│                    │                                            │
│  ┌─────────────────┼──────────────────────────────────────┐    │
│  │  CONTROLLERS    │                                      │    │
│  │  ├─ AuthCtrl │  │ (validar JWT, roles)     │            │
│  │  ├─ UserCtrl             │            │
│  │  ├─ ClassCtrl            │            │
│  │  ├─ PaymentCtrl          │            │
│  │  └─ EventCtrl            │            │
│  └─────────────────┼──────────────────────────────────────┘    │
│                    │                                            │
│  ┌─────────────────▼──────────────────────────────────────┐    │
│  │  MIDDLEWARE                                           │    │
│  │  ├─ authMiddleware (valida JWT token)                 │    │
│  │  ├─ roleMiddleware (verifica role: admin/docente)     │    │
│  │  └─ errorHandler (captura erros)                      │    │
│  └──────────────────────────────────────────────────────────┘  │
│                    ▲                                            │
│                    │                                            │
│  ┌─────────────────┼──────────────────────────────────────┐    │
│  │  SERVICES       │ (Regras de Negócio)                │    │
│  │  ├─ AuthService      │                                      │
│  │  │   └─ login()      │   (gera JWT, valida firstLogin)      │
│  │  │   └─ changePassword() (force no first login)             │
│  │  │                   │                                      │
│  │  ├─ UserService       │                                      │
│  │  │   └─ CRUD operations                                     │
│  │  │                                                          │
│  │  ├─ PaymentService    │   (calcular totals, etc.)          │
│  │  │                                                          │
│  │  └─ SalaryService     │   (calcular salários)               │
│  └─────────────────┼──────────────────────────────────────┘    │
│                    │                                            │
│  ┌─────────────────▼──────────────────────────────────────┐    │
│  │  MODELS (Sequelize)                                   │    │
│  │  ├─ User        (admin, docente, aluno)               │    │
│  │  ├─ Class       (aulas de música)                     │    │
│  │  ├─ Enrollment  (aluno → aula)                        │    │
│  │  ├─ Attendance  (presença em aula)                    │    │
│  │  ├─ Payment     (pagamento)                           │    │
│  │  ├─ Salary      (salário docente)                     │    │
│  │  ├─ Event       (evento)                              │    │
│  │  └─ EventRSVP   (confirmação evento)                  │    │
│  └──────────────────────────────────────────────────────────┘  │
│                    ▲                                            │
│                    │ Sequelize ORM                              │
│                    │                                            │
└────────────────────┼────────────────────────────────────────────┘
                     │
       ┌─────────────┴─────────────┐
       │                           │
┌──────▼────────┐      ┌──────────▼─────┐
│   PostgreSQL   │      │   .env config  │
│      DB        │      │ (JWT, DATABASE,│
│   (emmja_db)   │      │  CORS, etc.)   │
└────────────────┘      └────────────────┘
```

## O que Já Existe ✅

```
Backend/
├── config/
│   ├── database.js      ← Config PostgreSQL
│   └── sequelize.js     ← Instância Sequelize
├── models/
│   ├── User.js
│   ├── Class.js
│   ├── Enrollment.js
│   ├── Attendance.js
│   ├── Payment.js
│   ├── Salary.js
│   ├── Event.js
│   ├── EventRSVP.js
│   └── index.js         ← Importa todos + associations
├── migrations/          ← 8 migrations prontas
├── seeders/             ← 3 seeders prontos
├── utils/
│   ├── helpers.js       ← Funções utilitárias
│   └── constants.js     ← Constantes do sistema
├── middleware/          ← VAZIO (próxima fase)
├── services/            ← VAZIO (próxima fase)
├── controllers/         ← VAZIO (próxima fase)
├── routes/              ← VAZIO (próxima fase)
├── index.js             ← Servidor Express
├── package.json
├── .env.example
└── .sequelizerc.js
```

## O que Falta 📝

### Fase 6: Services
```javascript
// AuthService.js
export class AuthService {
  async login(email, password)          // Retorna JWT
  async changePassword(userId, old, new) // Força primeiro acesso
  async generateToken(user)              // Cria JWT
}

// UserService.js, PaymentService.js, SalaryService.js
```

### Fase 7: Controllers
```javascript
// AuthController.js
router.post('/login', login)
router.post('/change-password', changePassword)

// UserController.js, ClassController.js, etc.
```

### Fase 8: Middleware
```javascript
// authMiddleware.js   - Valida JWT
// roleMiddleware.js   - Verifica role (admin/docente/aluno)
// errorHandler.js     - Captura erros
```

### Fase 9: Frontend React
```
frontend/
├── src/
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ClassesPage.jsx
│   │   ├── PaymentsPage.jsx
│   │   ├── EventsPage.jsx
│   │   └── ProfilePage.jsx
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Table.jsx
│   │   ├── Form.jsx
│   │   └── Modal.jsx
│   ├── services/
│   │   └── api.js       ← Axios client
│   ├── App.jsx
│   └── index.jsx
├── tailwind.config.js   ← Configuração Tailwind
└── package.json
```

---

## 🚀 Fluxo de Login (Exemplo)

```
1. Utilizador acessa http://localhost:3000
   └─ React renderiza LoginPage

2. Utilizador entra email + password
   └─ Frontend faz POST /api/auth/login

3. Backend (AuthService):
   ├─ Valida email/password
   ├─ Se correto, gera JWT token
   ├─ Se firstLogin==true, retorna flag "MUST_CHANGE_PASSWORD"
   └─ Retorna { token, user, mustChangePassword }

4. Frontend:
   ├─ Se mustChangePassword==true:
   │  └─ Redireciona para ChangePasswordPage
   ├─ Senão:
   │  └─ Redireciona para DashboardPage
   └─ Guarda token em localStorage

5. Cada request posterior:
   ├─ Frontend envia JWT no header: Authorization: Bearer <token>
   ├─ Backend (authMiddleware) valida JWT
   └─ Se válido, continua; se inválido, retorna 401
```

---

## 💡 Conceitos Importantes

### 🔐 JWT (JSON Web Token)
- Gerado no login, armazenado no frontend
- Enviado em cada request no header
- Contém dados do utilizador (id, role, etc.)

### 🛡️ Middleware
- Funções que interceptam requests
- Validam JWT, roles, etc.
- Encontram-se **entre Route e Controller**

### 📦 Services
- Contêm toda a lógica de negócio
- Controllers chamam Services
- Services chamam Models (BD)

### 🗄️ Models + Associations
- User.hasMany(Class) - Um docente tem várias aulas
- Class.hasMany(Enrollment) - Uma aula tem várias inscrições
- Etc...

---

## 📞 Próximo Passo

**Quando estiveres pronto, diz-me:**
- "Cria o AuthService"
- "Cria o AuthController"
- "Criar o authMiddleware"
- Ou outra coisa!

Vou criar com exemplos práticos e explicações! 🎵
