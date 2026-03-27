import 'dotenv/config';
import { Client } from 'pg';

async function createDatabase() {
  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'postgres', // Conecta ao DB padrão primeiro
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL');

    // Verifica se BD já existe
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}';`
    );

    if (result.rows.length > 0) {
      console.log(`✅ Base de dados "${process.env.DB_NAME}" já existe!`);
    } else {
      await client.query(`CREATE DATABASE "${process.env.DB_NAME}";`);
      console.log(`✅ Base de dados "${process.env.DB_NAME}" criada com sucesso!`);
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

createDatabase();
