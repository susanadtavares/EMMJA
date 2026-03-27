import sequelize from './sequelize.js';
import models from '../models/index.js';

/**
 * db.js
 * 
 * Exporta um objeto com:
 * - sequelize: instância do Sequelize
 * - models: todos os modelos do Sequelize
 * 
 * Uso:
 * import db from '../config/db.js';
 * const { User, Class, etc } = db.models;
 */

export default {
  sequelize,
  models,
};
