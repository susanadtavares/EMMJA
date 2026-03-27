/** @type {import('sequelize-cli').Migration} */
export const up = (queryInterface, Sequelize) => {
  return queryInterface.createTable('payments', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    enrollmentId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'enrollments',
        key: 'id',
      },
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentDate: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    referenceMonth: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    paymentMethod: {
      type: Sequelize.ENUM('cash', 'transfer', 'card'),
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM('pago', 'pendente', 'atrasado'),
      defaultValue: 'pago',
    },
    notes: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  });
};

export const down = (queryInterface) => {
  return queryInterface.dropTable('payments');
};
