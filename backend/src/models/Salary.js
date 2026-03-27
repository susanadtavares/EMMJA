import { DataTypes } from 'sequelize';

/**
 * Model Salary
 * 
 * Registo de salários dos docentes
 * O sistema calcula automaticamente o salário based em:
 * - Número de aulas dadas no mês
 * - Valor pago por hora/aula
 * 
 * Exemplo: Prof. João Silva - Março 2026 - 40 aulas × €15 = €600
 */
export default (sequelize) => {
  const Salary = sequelize.define('Salary', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Ex: 2024-03 (março de 2024)',
    },
    numberClasses: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Número de aulas dadas nesse mês',
    },
    hourlyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Valor por aula (ex: €15)',
    },
    totalSalary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Total = numberClasses × hourlyRate',
    },
    status: {
      type: DataTypes.ENUM('pago', 'pendente'),
      defaultValue: 'pendente',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'salaries',
    timestamps: true,
  });

  return Salary;
};
