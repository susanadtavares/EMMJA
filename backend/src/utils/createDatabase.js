import pkg from 'pg';
import 'dotenv/config';

const { Client } = pkg;

const client = new Client({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: 'postgres', // Conectar à BD padrão
});

async function createDatabase() {
  try {
    console.log('🔄 A conectar ao PostgreSQL...');
    await client.connect();
    
    console.log('📝 A criar BD emmja_db...');
    await client.query('CREATE DATABASE emmja_db;');
    
    console.log('✅ BD emmja_db criada com sucesso!');
  } catch (error) {
    if (error.code === '42P04') {
      console.log('ℹ️  BD emmja_db já existe!');
    } else {
      console.error('❌ Erro:', error.message);
    }
  } finally {
    await client.end();
  }
}

createDatabase();
