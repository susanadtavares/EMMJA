import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  // IDs dos utilizadores criados no seeder anterior
  const teacherId = 'será preenchido dinamicamente';
  const classId = uuidv4();

  // Buscar o ID do professor (João Silva)
  const teachers = await queryInterface.sequelize.query(
    "SELECT id FROM users WHERE email = 'joao@escola.pt'"
  );
  const actualTeacherId = teachers[0][0].id;

  return queryInterface.bulkInsert('classes', [
    {
      id: classId,
      name: 'Piano - Iniciantes',
      instrument: 'Piano',
      teacherId: actualTeacherId,
      dayOfWeek: 'terça',
      startTime: '14:00:00',
      endTime: '15:00:00',
      capacity: 5,
      description: 'Aula de piano para iniciantes',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Guitarra - Intermédio',
      instrument: 'Guitarra',
      teacherId: actualTeacherId,
      dayOfWeek: 'quinta',
      startTime: '16:00:00',
      endTime: '17:00:00',
      capacity: 6,
      description: 'Aula de guitarra para nivel intermédio',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
};

export const down = (queryInterface) => {
  return queryInterface.bulkDelete('classes', null, {});
};
