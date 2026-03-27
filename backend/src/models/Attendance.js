import { DataTypes } from 'sequelize';

/**
 * Model Attendance
 * 
 * Registo de presenças/sumários das aulas
 * Cada linha = uma aula dada (data + hora)
 * Os docentes preenchem sumários e marcam presenças aqui
 * 
 * Exemplo: 20/03/2026 - Aula de Piano - Prof. João Silva
 *          Presentes: Maria, João / Faltas: José
 */
export default (sequelize) => {
  const Attendance = sequelize.define('Attendance', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'classes',
        key: 'id',
      },
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    classDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Data quando a aula ocorreu',
    },
    isPresent: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Sumário da aula escrito pelo docente',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Notas sobre o desempenho do aluno',
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
    tableName: 'attendances',
    timestamps: true,
  });

  return Attendance;
};
