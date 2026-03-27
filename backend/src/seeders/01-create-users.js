import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  const adminId = uuidv4();
  const teacherId = uuidv4();
  const studentId1 = uuidv4();
  const studentId2 = uuidv4();

  const hashedPassword = await bcrypt.hash('senha123', 10);

  return queryInterface.bulkInsert('users', [
    {
      id: adminId,
      email: 'admin@escola.pt',
      password: hashedPassword,
      fullName: 'Admin Sistema',
      role: 'admin',
      phone: '91234567',
      address: 'Rua da Escola, 1',
      firstLogin: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: teacherId,
      email: 'joao@escola.pt',
      password: hashedPassword,
      fullName: 'João Silva',
      role: 'docente',
      phone: '92345678',
      address: 'Rua do Professor, 10',
      firstLogin: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: studentId1,
      email: 'maria@escola.pt',
      password: hashedPassword,
      fullName: 'Maria Santos',
      role: 'aluno',
      phone: '93456789',
      address: 'Rua do Aluno, 20',
      firstLogin: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: studentId2,
      email: 'jose@escola.pt',
      password: hashedPassword,
      fullName: 'José Silva',
      role: 'aluno',
      phone: '94567890',
      address: 'Rua do Aluno, 30',
      firstLogin: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
};

export const down = (queryInterface) => {
  return queryInterface.bulkDelete('users', null, {});
};
