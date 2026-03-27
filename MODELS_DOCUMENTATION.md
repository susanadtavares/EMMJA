# 📊 Models Sequelize - Documentação

## 🎯 Visão Geral

Os models definem a **estrutura das tabelas** na BD. Cada model = 1 tabela na BD.

---

## 📋 Os 8 Models

### 1. **User** (Utilizadores)
Todos os utilizadores do sistema.

**Campos principais:**
- `email`: Email único (login)
- `password`: Senha criptografada
- `role`: Admin, Docente ou Aluno
- `firstLogin`: **true** = DEVE mudar password na primeira entrada
- `isActive`: Se o utilizador está ativo

**Exemplo:**
```
João Silva | joao@escola.pt | role: docente | firstLogin: true
Maria Santos | maria@escola.pt | role: aluno | firstLogin: true
```

---

### 2. **Class** (Aulas)
As aulas/lições de música.

**Campos principais:**
- `name`: Nome da aula (ex: "Piano - Iniciantes")
- `instrument`: Instrumento (Piano, Guitarra, etc.)
- `teacherId`: Quem leciona (FK para User)
- `dayOfWeek`, `startTime`, `endTime`: Horário
- `capacity`: Quantos alunos cabem

**Exemplo:**
```
Piano - Iniciantes | Terça, 14:00-15:00 | Prof. João Silva | 10 lugares
```

---

### 3. **Enrollment** (Inscrições)
Relação **many-to-many** entre alunos e aulas.

Um aluno = várias aulas | Uma aula = vários alunos

**Campos principais:**
- `studentId`: FK para User (aluno)
- `classId`: FK para Class (aula)
- `monthlyFee`: Preço mensal da aula
- `status`: ativo, pausado ou cancelado

**Exemplo:**
```
Maria Santos está inscrita na Aula de Piano (€50/mês) - ativo
Maria Santos está inscrita na Aula de Guitarra (€40/mês) - ativo
João Silva está inscrito na Aula de Piano (€50/mês) - ativo
```

---

### 4. **Attendance** (Presenças e Sumários)
Registo de cada aula e presença/falta dos alunos.

**Campos principais:**
- `classDate`: Quando a aula ocorreu
- `studentId`, `classId`: Qual aluno e qual aula
- `isPresent`: true (presente) ou false (falta)
- `summary`: Sumário escrito pelo docente
- `notes`: Observações sobre o desempenho

**Exemplo:**
```
20/03/2026 - Piano - João Silva - Maria Santos - PRESENTE - "Aprendeu escalas maiores"
20/03/2026 - Piano - João Silva - José Silva - FALTA
```

---

### 5. **Payment** (Pagamentos dos Alunos)
Cada pagamento feito um um aluno.

**Campos principais:**
- `enrollmentId`: FK para Enrollment (qual inscrição é paga)
- `amount`: Valor pago
- `referenceMonth`: Mês-Ano (ex: 2024-03)
- `paymentMethod`: cash, transfer ou card
- `status`: pago, pendente ou atrasado

**Exemplo:**
```
Maria Santos pagou €50 em 25/03/2026 para aula de Piano (ref: mar/2026)
João Silva pagou €40 em 01/03/2026 para aula de Guitarra (ref: fev/2026) - ATRASADO
```

---

### 6. **Salary** (Salários dos Docentes)
Salário mensal de cada docente.

**Campos principais:**
- `teacherId`: FK para User (docente)
- `month`: Mês-Ano (ex: 2024-03)
- `numberClasses`: Quantas aulas deu
- `hourlyRate`: Preço por aula
- `totalSalary`: numberClasses × hourlyRate

**Exemplo:**
```
Prof. João Silva - Mar/2026 - 40 aulas × €15 = €600 - PENDENTE
Prof. João Silva - Fev/2026 - 38 aulas × €15 = €570 - PAGO
```

---

### 7. **Event** (Eventos)
Eventos da escola (concertos, workshops, etc.).

**Campos principais:**
- `title`: Nome do evento
- `eventDate`: Quando ocorre
- `location`: Onde
- `eventType`: concerto, workshop, conferência, etc.
- `isPublic`: Aberto a todos? true/false
- `createdBy`: Quem criou (FK para User)

**Exemplo:**
```
Concerto de Primavera - 15/04/2026 - 19:00 - Auditório - Todos - Criado por Admin
```

---

### 8. **EventRSVP** (Confirmações de Presença em Eventos)
Relação **many-to-many** entre utilizadores e eventos.

Um utilizador = vários eventos | Um evento = vários utilizadores

**Campos principais:**
- `userId`, `eventId`: Quem e qual evento
- `status`: confirmado, talvez ou não_pode
- `responseDate`: Quando respondeu

**Exemplo:**
```
Maria Santos confirmou presença no Concerto (sim)
João Silva respondeu talvez para o Workshop
```

---

## 🔗 Relações entre Models

```
User
  ├─ 1→M Classes (como docente)
  ├─ 1→M Enrollments (como aluno)
  ├─ 1→M Attendances (como aluno)
  ├─ 1→M Salaries (como docente)
  ├─ 1→M Events (criador)
  └─ 1→M EventRSVPs

Class
  ├─ M→1 User (docente)
  ├─ 1→M Enrollments
  └─ 1→M Attendances

Enrollment (muitos-para-muitos: Alunos ↔ Aulas)
  ├─ M→1 User (aluno)
  ├─ M→1 Class (aula)
  └─ 1→M Payments

Attendance
  ├─ M→1 User (aluno)
  └─ M→1 Class (aula)

Payment
  └─ M→1 Enrollment

Salary
  └─ M→1 User (docente)

Event
  ├─ M→1 User (criador)
  └─ 1→M EventRSVPs

EventRSVP (muitos-para-muitos: Utilizadores ↔ Eventos)
  ├─ M→1 User
  └─ M→1 Event
```

---

## 💡 Exemplo Prático

**Cenário:** Maria, aluna, está inscrita em Piano com Prof. João

1. **User**: Maria (aluno), João (docente)
2. **Class**: Piano - Terça 14h - Prof. João
3. **Enrollment**: Maria → Piano (€50/mês)
4. **Attendance**: 20/03 - Maria presente na aula de Piano
5. **Payment**: Maria pagou €50 em 25/03 pela aula de Piano (ref: mar/2026)
6. **Event**: Concerto 15/04 criado por Admin
7. **EventRSVP**: Maria confirmou presença no Concerto

---

## ✅ Próximos Passos

1. Criar **migrations** (histórico de mudanças na BD)
2. Criar **seeders** (dados iniciais para testes)
3. Criar **services** (regras de negócio)
4. Criar **controllers** (lógica das rotas)
5. Implementar **autenticação JWT**
