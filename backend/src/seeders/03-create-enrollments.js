import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  // Buscar IDs dos alunos e aulas
  const students = await queryInterface.sequelize.query(
    "SELECT id FROM users WHERE role = 'aluno'"
  );
  const classes = await queryInterface.sequelize.query(
    "SELECT id FROM classes"
  );

  if (students[0].length === 0 || classes[0].length === 0) {
    console.log('Nenhum aluno ou aula encontrados para criar inscrições');
    return;
  }

  const enrollments = [];
  for (const student of students[0]) {
    for (let i = 0; i < Math.min(2, classes[0].length); i++) {
      enrollments.push({
        id: uuidv4(),
        studentId: student.id,
        classId: classes[0][i].id,
        enrollmentDate: new Date(),
        monthlyFee: i === 0 ? 50.00 : 40.00,
        status: 'ativo',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  return queryInterface.bulkInsert('enrollments', enrollments);
};

export const down = (queryInterface) => {
  return queryInterface.bulkDelete('enrollments', null, {});
};
