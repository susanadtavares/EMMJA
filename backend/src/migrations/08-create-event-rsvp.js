/** @type {import('sequelize-cli').Migration} */
export const up = (queryInterface, Sequelize) => {
  return queryInterface.createTable('event_rsvps', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    eventId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id',
      },
    },
    status: {
      type: Sequelize.ENUM('confirmado', 'talvez', 'não_pode'),
      defaultValue: 'confirmado',
    },
    responseDate: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
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
  return queryInterface.dropTable('event_rsvps');
};
