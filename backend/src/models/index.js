import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from '../config/sequelize.js';

// ES modules: obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const models = {};

// Importar todos os models
const files = fs.readdirSync(__dirname).filter(file => file !== 'index.js');

for (const file of files) {
  const modelModule = await import(`./${file}`);
  const model = modelModule.default(sequelize);
  models[model.name] = model;
}

// ==========================================
// DEFINIR RELAÇÕES ENTRE MODELS (ASSOCIATIONS)
// ==========================================

// User → Class (um docente tem várias aulas)
models.User.hasMany(models.Class, {
  foreignKey: 'teacherId',
  as: 'classes',
});

models.Class.belongsTo(models.User, {
  foreignKey: 'teacherId',
  as: 'teacher',
});

// Class → Enrollment (uma aula tem várias inscrições)
models.Class.hasMany(models.Enrollment, {
  foreignKey: 'classId',
  as: 'enrollments',
});

models.Enrollment.belongsTo(models.Class, {
  foreignKey: 'classId',
  as: 'class',
});

// User → Enrollment (um aluno tem várias inscrições)
models.User.hasMany(models.Enrollment, {
  foreignKey: 'studentId',
  as: 'enrollments',
});

models.Enrollment.belongsTo(models.User, {
  foreignKey: 'studentId',
  as: 'student',
});

// Enrollment → Payment (uma inscrição tem vários pagamentos)
models.Enrollment.hasMany(models.Payment, {
  foreignKey: 'enrollmentId',
  as: 'payments',
});

models.Payment.belongsTo(models.Enrollment, {
  foreignKey: 'enrollmentId',
  as: 'enrollment',
});

// Class → Attendance (uma aula tem várias presenças)
models.Class.hasMany(models.Attendance, {
  foreignKey: 'classId',
  as: 'attendances',
});

models.Attendance.belongsTo(models.Class, {
  foreignKey: 'classId',
  as: 'class',
});

// User → Attendance (um aluno tem várias presenças)
models.User.hasMany(models.Attendance, {
  foreignKey: 'studentId',
  as: 'attendances',
});

models.Attendance.belongsTo(models.User, {
  foreignKey: 'studentId',
  as: 'student',
});

// User → Salary (um docente tem vários salários mensais)
models.User.hasMany(models.Salary, {
  foreignKey: 'teacherId',
  as: 'salaries',
});

models.Salary.belongsTo(models.User, {
  foreignKey: 'teacherId',
  as: 'teacher',
});

// User → Event (um admin cria eventos)
models.User.hasMany(models.Event, {
  foreignKey: 'createdBy',
  as: 'createdEvents',
});

models.Event.belongsTo(models.User, {
  foreignKey: 'createdBy',
  as: 'creator',
});

// Event → EventRSVP
models.Event.hasMany(models.EventRSVP, {
  foreignKey: 'eventId',
  as: 'rsvps',
});

models.EventRSVP.belongsTo(models.Event, {
  foreignKey: 'eventId',
  as: 'event',
});

// User → EventRSVP
models.User.hasMany(models.EventRSVP, {
  foreignKey: 'userId',
  as: 'eventRsvps',
});

models.EventRSVP.belongsTo(models.User, {
  foreignKey: 'userId',
  as: 'user',
});

export default models;
export { sequelize };
