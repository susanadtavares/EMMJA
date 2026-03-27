import 'dotenv/config';
import { Client } from 'pg';

async function checkData() {
  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();

    console.log('\n📊 DADOS POPULADOS NA BD:\n');

    // Verificar utilizadores
    console.log('👥 UTILIZADORES:');
    const users = await client.query('SELECT id, email, role, "firstLogin" FROM users;');
    console.table(users.rows);

    // Verificar aulas
    console.log('\n🎹 AULAS:');
    const classes = await client.query('SELECT id, name, instrument, "dayOfWeek", "startTime", capacity FROM classes;');
    console.table(classes.rows);

    // Verificar inscrições
    console.log('\n📝 INSCRIÇÕES (Enrollments):');
    const enrollments = await client.query('SELECT id, "studentId", "classId", "monthlyFee", status FROM enrollments;');
    console.table(enrollments.rows);

    // Total de registos em cada tabela
    console.log('\n📈 TOTAL DE REGISTOS:');
    const tables = ['users', 'classes', 'enrollments', 'attendances', 'payments', 'salaries', 'events', 'event_rsvps'];
    
    for (const table of tables) {
      const result = await client.query(`SELECT COUNT(*) as count FROM ${table};`);
      console.log(`${table}: ${result.rows[0].count} registos`);
    }

    console.log('\n✅ Tudo pronto para usar!\n');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.end();
  }
}

checkData();
