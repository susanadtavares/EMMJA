/** @type {import('sequelize-cli').Migration} */
export const up = (queryInterface, Sequelize) => {
  return queryInterface.createTable('events', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    eventDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    capacity: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    eventType: {
      type: Sequelize.ENUM('concerto', 'workshop', 'conferência', 'competição', 'outro'),
      defaultValue: 'outro',
    },
    isPublic: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    createdBy: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
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
  return queryInterface.dropTable('events');
};
