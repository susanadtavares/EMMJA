# ⚡ Guia Rápido - Como Começar

## 🚀 Setup Inicial (5 minutos)

### 1️⃣ Instalar PostgreSQL (se não tiveres)
**Windows:**
```
Descarrega: https://www.postgresql.org/download/windows/
Durante instalação:
- Username: postgres (default)
- Password: postgres (ou a que escolheres)
- Port: 5432 (default)
```

**Depois, cria a base de dados:**
```sql
CREATE DATABASE emmja_db;
```

### 2️⃣ Clonar/Setup Backend
```bash
cd backend
cp .env.example .env

# Edita .env se necessário (principalmente DB_PASSWORD se mudaste)
```

### 3️⃣ Instalar Dependências
```bash
npm install
```

### 4️⃣ Executar Migrations (criar tabelas)
```bash
npm run migrate
```

**Output esperado:**
```
Sequelize CLI [Node: 18.x, CLI: 6.6.2, ORM: 6.35.2]
Executed migration 01-create-user.js
Executed migration 02-create-class.js
... (todas 8 migrations)
```

### 5️⃣ Executar Seeders (dados de teste)
```bash
npm run seed
```

**Output esperado:**
```
Seed completed
Seeded: 01-create-users.js
Seeded: 02-create-classes.js
Seeded: 03-create-enrollments.js
```

### 6️⃣ Iniciar Backend
```bash
npm run dev
```

**Output esperado:**
```
🚀 Servidor rodando em http://localhost:5000
```

### 7️⃣ Testar Conexão
Abre outro terminal:
```bash
curl http://localhost:5000/api/health
# Retorna: { "message": "Servidor está funcionando!" }

curl http://localhost:5000/api/db-test
# Retorna: { "message": "Conexão com BD bem-sucedida!" }
```

---

## 🧪 Testando o Login

### Via cURL (Terminal)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@escola.pt","password":"senha123"}'
```

**Resposta esperada (quando fazeres o controllers):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "email": "admin@escola.pt",
    "fullName": "Admin Sistema",
    "role": "admin",
    "firstLogin": true
  },
  "mustChangePassword": true
}
```

### Via Postman (Recomendado)
1. Abre Postman
2. Cria novo request: POST http://localhost:5000/api/auth/login
3. Body → raw → JSON:
```json
{
  "email": "admin@escola.pt",
  "password": "senha123"
}
```
4. Send

---

## 📊 Dados de Teste Disponíveis

Depois de `npm run seed`:

### Utilizadores:
| Email | Senha | Role | firstLogin |
|-------|-------|------|-----------|
| admin@escola.pt | senha123 | Admin | true |
| joao@escola.pt | senha123 | Docente | true |
| maria@escola.pt | senha123 | Aluno | true |
| jose@escola.pt | senha123 | Aluno | true |

### Aulas:
- **Piano - Iniciantes** (Terça 14:00-15:00, Prof. João, 5 lugares)
- **Guitarra - Intermédio** (Quinta 16:00-17:00, Prof. João, 6 lugares)

### Inscrições:
- Maria: Piano (€50/mês) + Guitarra (€40/mês)
- José: Piano (€50/mês) + Guitarra (€40/mês)

---

## 📚 Ficheiros Importantes

| Ficheiro | Para quê |
|----------|----------|
| `.env` | Variáveis de ambiente (BD, JWT secret, etc.) |
| `package.json` | Dependências e scripts |
| `src/models/` | Estrutura da BD |
| `src/migrations/` | Histórico de mudanças na BD |
| `src/seeders/` | Dados iniciais para teste |
| `src/utils/` | Funções reutilizáveis |
| `SETUP_GUIDE.md` | O que foi criado |
| `ARCHITECTURE.md` | Diagrama e fluxo da app |
| `MODELS_DOCUMENTATION.md` | Explicação detalhada dos models |

---

## 🐛 Troubleshooting

### "Error: connect ECONNREFUSED 127.0.0.1:5432"
- PostgreSQL não está rodando
- **Solução:** Abre Services (Windows) e verifica se "postgresql" está ativo

### "Error: password authentication failed for user"
- Password do PostgreSQL está incorreto em `.env`
- **Solução:** Edita `DB_PASSWORD` em `.env`

### "SequelizeMigrationError"
- Migrations já foram executadas
- **Solução:** `npm run migrate:undo` e depois `npm run migrate` novamente

### Preciso resetar a BD
```bash
# Desfaz tudo
npm run seed:undo:all
npm run migrate:undo:all

# Recria tudo
npm run migrate
npm run seed
```

---

## ✅ Checklist de Setup

- [ ] PostgreSQL instalado
- [ ] BD `emmja_db` criada
- [ ] `.env` preenchido
- [ ] `npm install` concluído
- [ ] `npm run migrate` concluído
- [ ] `npm run seed` concluído
- [ ] `npm run dev` rodando
- [ ] http://localhost:5000/api/health funciona

---

## 🎯 Próximas Tarefas (Ordem Recomendada)

1. **AuthService** - Cria login logic
2. **AuthController** - Expõe login na API
3. **authMiddleware** - Protege rotas com JWT
4. **roleMiddleware** - Verifica permissões (admin, docente, aluno)
5. **UserController** - CRUD de utilizadores
6. **Frontend** - React components + pages

---

## 💬 Dúvidas?

Se tiveres problemas:
1. Verifica a consola (npm run dev) para ver errros
2. Consulta ARCHITECTURE.md para diagrama
3. Consulta MODELS_DOCUMENTATION.md para entender models
4. Pede ajuda! 😊

**Pronto para começar? Diz-me qual é o próximo passo!** 🎵
