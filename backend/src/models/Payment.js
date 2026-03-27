import { DataTypes } from 'sequelize';

/**
 * Model Payment
 * 
 * Registo de pagamentos dos alunos
 * Cada linha = um pagamento feito por um aluno
 * O sistema regista quando foi pago, quanto, e que aula
 * 
 * Exemplo: João Silva pagou €50 em 25/03/2026 pela aula de Piano (referência: mar/2026)
 */
export default (sequelize) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    enrollmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'enrollments',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    referenceMonth: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Ex: 2024-03 (março de 2024)',
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'transfer', 'card'),
      allowNull: false,
      comment: 'Método de pagamento',
    },
    status: {
      type: DataTypes.ENUM('pago', 'pendente', 'atrasado'),
      defaultValue: 'pago',
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
    tableName: 'payments',
    timestamps: true,
  });

  return Payment;
};
