/** @type {import('sequelize-cli').Migration} */
export const up = (queryInterface, Sequelize) => {
  return queryInterface.createTable('attendances', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    classId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'classes',
        key: 'id',
      },
    },
    studentId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    classDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    isPresent: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    summary: {
      type: Sequelize.TEXT,
      allowNull: true,
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
  return queryInterface.dropTable('attendances');
};
