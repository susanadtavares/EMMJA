import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './config/db.js';

// Rotas
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
// import classRoutes from './routes/classRoutes.js';
// import eventRoutes from './routes/eventRoutes.js';
// import paymentRoutes from './routes/paymentRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/classes', classRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/api/payments', paymentRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ message: 'Servidor está funcionando!' });
});

// Teste de conexão com BD
app.get('/api/db-test', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({ message: 'Conexão com BD bem-sucedida!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao conectar à BD', details: error.message });
  }
});

// Na Vercel, a aplicação é executada como uma função serverless.
// Em desenvolvimento, mantemos o servidor HTTP local habitual.
const startLocalServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Conexão com BD bem-sucedida!');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao conectar à BD:', error);
    process.exit(1);
  }
};

if (!process.env.VERCEL) {
  startLocalServer();
}

export default app;
