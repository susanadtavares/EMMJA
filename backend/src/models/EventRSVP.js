import { DataTypes } from 'sequelize';

/**
 * Model EventRSVP
 * 
 * Relação many-to-many entre Users e Events
 * Permite que utilizadores façam RSVP (confirmação de presença) aos eventos
 * 
 * Exemplo: João Silva confirmou presença no Concerto de Primavera
 */
export default (sequelize) => {
  const EventRSVP = sequelize.define('EventRSVP', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'events',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('confirmado', 'talvez', 'não_pode'),
      defaultValue: 'confirmado',
    },
    responseDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
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
    tableName: 'event_rsvps',
    timestamps: true,
  });

  return EventRSVP;
};
