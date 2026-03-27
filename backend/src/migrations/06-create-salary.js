/** @type {import('sequelize-cli').Migration} */
export const up = (queryInterface, Sequelize) => {
  return queryInterface.createTable('salaries', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    teacherId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    month: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    numberClasses: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    hourlyRate: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    totalSalary: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM('pago', 'pendente'),
      defaultValue: 'pendente',
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
  return queryInterface.dropTable('salaries');
};
