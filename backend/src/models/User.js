import { DataTypes } from 'sequelize';

/**
 * Model User
 * 
 * Representa todos os utilizadores do sistema:
 * - Admin: acesso total
 * - Docente: gestão de alunos e sumários
 * - Aluno: visualiza própria informação
 * 
 * O campo "firstLogin" obriga o utilizador a mudar password na primeira entrada
 */
export default (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'docente', 'aluno'),
      allowNull: false,
      defaultValue: 'aluno',
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    firstLogin: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Se true, o utilizador DEVE mudar password na primeira entrada',
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
    tableName: 'users',
    timestamps: true,
  });

  return User;
};
