import { DataTypes } from 'sequelize';

/**
 * Model Class
 * 
 * Representa as aulas
 * - Cada aula tem um docente responsável
 * - Cada aula pode ter vários alunos (relação many-to-many via Enrollment)
 */
export default (sequelize) => {
  const Class = sequelize.define('Class', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Ex: Piano - Iniciantes',
    },
    instrument: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Ex: Piano, Guitarra, Violino, etc.',
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    dayOfWeek: {
      type: DataTypes.ENUM('segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'),
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      comment: 'Ex: 14:00:00',
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tableName: 'classes',
    timestamps: true,
  });

  return Class;
};
