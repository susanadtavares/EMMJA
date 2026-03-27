import { DataTypes } from 'sequelize';

/**
 * Model Event
 * 
 * Eventos da escola (concertos, apresentações, conferências, etc.)
 * Os utilizadores podem RSVP aos eventos
 * 
 * Exemplo: Concerto de Primavera - 15/04/2026 às 19h no Auditório
 */
export default (sequelize) => {
  const Event = sequelize.define('Event', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    eventType: {
      type: DataTypes.ENUM('concerto', 'workshop', 'conferência', 'competição', 'outro'),
      defaultValue: 'outro',
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'true = aberto a todos, false = apenas alunos',
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
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
    tableName: 'events',
    timestamps: true,
  });

  return Event;
};
