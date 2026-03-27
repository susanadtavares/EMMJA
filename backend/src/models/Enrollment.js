import { DataTypes } from 'sequelize';

/**
 * Model Enrollment
 * 
 * Relação many-to-many entre Student (User) e Class
 * Um aluno pode estar inscrito em várias aulas
 * Uma aula pode ter vários alunos
 * 
 * Exemplo: João Silva está inscrito na Aula de Piano
 */
export default (sequelize) => {
  const Enrollment = sequelize.define('Enrollment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'classes',
        key: 'id',
      },
    },
    enrollmentDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    monthlyFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Mensalidade da aula',
    },
    status: {
      type: DataTypes.ENUM('ativo', 'pausado', 'cancelado'),
      defaultValue: 'ativo',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'enrollments',
    timestamps: true,
  });

  return Enrollment;
};
