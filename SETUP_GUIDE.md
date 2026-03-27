# 🎵 EMMJA - Backend (Models & Migrations)

## ✅ O que foi criado até agora

### 1️⃣ **8 Models Sequelize** (Estrutura da BD)

Criados em `backend/src/models/`:

```
├── User.js          → Utilizadores (Admin, Docente, Aluno)
├── Class.js         → Aulas/Lições de música
├── Enrollment.js    → Inscrições (Aluno → Aula) 
├── Attendance.js    → Presenças e Sumários
├── Payment.js       → Pagamentos dos Alunos
├── Salary.js        → Salários dos Docentes
├── Event.js         → Eventos da Escola
├── EventRSVP.js     → Confirmação de Presença em Eventos
└── index.js         → Importa todos + define relações
```

### 2️⃣ **8 Migrations** (Criar tabelas na BD)

Criadas em `backend/src/migrations/`:

```
├── 01-create-user.js          → Tabela users
├── 02-create-class.js         → Tabela classes
├── 03-create-enrollment.js    → Tabela enrollments
├── 04-create-attendance.js    → Tabela attendances
├── 05-create-payment.js       → Tabela payments
├── 06-create-salary.js        → Tabela salaries
├── 07-create-event.js         → Tabela events
└── 08-create-event-rsvp.js    → Tabela event_rsvps
```

### 3️⃣ **3 Seeders** (Dados iniciais para testes)

Criados em `backend/src/seeders/`:

```
├── 01-create-users.js         → Admin, Docente, 2 Alunos
├── 02-create-classes.js       → 2 Aulas de Música
└── 03-create-enrollments.js   → Alunos inscritos em Aulas
```

**Login de teste:**
- Email: `admin@escola.pt` | Senha: `senha123`
- Email: `joao@escola.pt` | Senha: `senha123` (Docente)
- Email: `maria@escola.pt` | Senha: `senha123` (Aluno)

### 4️⃣ **Ficheiros Utilitários**

#### `backend/src/utils/helpers.js`
Funções úteis:
- `hashPassword()` - Criptografar senhas
- `comparePassword()` - Verificar senhas
- `formatDate()` - Formatar datas
- `formatCurrency()` - Formatar moeda EUR
- `calculateMonthlyTotal()` - Total de mensalidades
- `isValidEmail()` - Validar email
- `getMonthYear()` - Formato YYYY-MM

#### `backend/src/utils/constants.js`
Constantes (roles, status, etc.):
```javascript
ROLES = { ADMIN, DOCENTE, ALUNO }
ENROLLMENT_STATUS = { ATIVO, PAUSADO, CANCELADO }
PAYMENT_STATUS = { PAGO, PENDENTE, ATRASADO }
PAYMENT_METHOD = { CASH, TRANSFER, CARD }
RSVP_STATUS = { CONFIRMADO, TALVEZ, NAO_PODE }
// ... e muitas mais
```

### 5️⃣ **Documentação**

- [MODELS_DOCUMENTATION.md](./MODELS_DOCUMENTATION.md) - Explicação detalhada de cada model e relações

---

## 🔗 Relações entre Models (Diagrama)

```
┌─────────┐
│  User   │ (utilizadores do sistema)
├─────────┤
│ Admin   │
│ Docente │ ──→ Classes (1→M)
│ Aluno   │ ──→ Enrollments (1→M)
│         │ ──→ Salaries (1→M)
│         │ ──→ Events (1→M) - criador
│         │ ──→ EventRSVPs (1→M)
└─────────┘

┌─────────────┐
│  Class      │ (aulas de música)
├─────────────┤
│ Piano       │ ─→ Enrollments (1→M)
│ Guitarra    │ ─→ Attendances (1→M)
│ Violino     │
└─────────────┘

┌──────────────────┐
│  Enrollment      │ (inscrição de aluno em aula)
├──────────────────┤
│ student ─→ User │
│ class ─→ Class  │ ─→ Payments (1→M)
│ fee: €50/mês     │
└──────────────────┘

┌──────────────────┐
│  Attendance      │ (presença em aula)
├──────────────────┤
│ class ─→ Class  │
│ student ─→ User │
│ summary: "..."   │
│ isPresent: true  │
└──────────────────┘

┌──────────────────┐
│  Payment         │ (pagamento efetuado)
├──────────────────┤
│ enrollment ─→ E. │
│ amount: €50      │
│ status: pago     │
└──────────────────┘

┌──────────────────┐
│  Salary          │ (salário docente)
├──────────────────┤
│ teacher ─→ User │
│ month: 2024-03   │
│ total: €600      │
└──────────────────┘

┌──────────────────┐
│  Event           │ (evento da escola)
├──────────────────┤
│ Concerto         │ ─→ EventRSVPs (1→M)
│ Workshop         │
│ creator ─→ User  │
└──────────────────┘

┌──────────────────┐
│  EventRSVP       │ (confirmação presença evento)
├──────────────────┤
│ event ─→ Event  │
│ user ─→ User    │
│ status: confirmado│
└──────────────────┘
```

---

## 🛠️ Próximos Passos

### 1. Instalar dependências e criar BD
```bash
cd backend
npm install
# Criar .env baseado em .env.example
npm run migrate
npm run seed
```

### 2. Criar Services (Regras de Negócio)
- `AuthService` - Login, JWT, "first login"
- `UserService` - CRUD de utilizadores
- `PaymentService` - Processar pagamentos
- `SalaryService` - Calcular salários

### 3. Criar Controllers (Rotas)
- `AuthController` - Login, register, change password
- `UserController` - CRUD users
- `ClassController` - CRUD classes
- `PaymentController` - CRUD payments

### 4. Implementar JWT Middleware
- Autenticação (validar token)
- Autorização (verificar role)
- Proteger rotas

### 5. Criar Frontend React
- Pages (Login, Dashboard, etc.)
- Components (Forms, Tables, etc.)
- Integrar com Backend

---

## 🚀 Como Completar Cada Passo

Quando pedires ajuda, specifica as próximas fases:

1. **Criar Services** → Explicarei AuthService em detalhe
2. **Criar Controllers** → Vou criar rotas simples e limpas
3. **Autenticação JWT** → Middleware de proteção das rotas
4. **Frontend React** → Pages e componentes com Tailwind

**Próximo passo? Diz-me e continuamos!** 🎵
