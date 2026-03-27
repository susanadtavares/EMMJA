import 'dotenv/config';
import { hashPassword } from '../utils/helpers.js';
import AuthService from './AuthService.js';
import EmailService from './EmailService.js';
import { ROLES } from '../utils/constants.js';

/**
 * UserService
 * 
 * Serviço para gestão de utilizadores:
 * - CRUD (Create, Read, Update, Delete)
 * - Criar utilizador + enviar email
 * - Atualizar perfil
 * - Listar utilizadores (com filtros por role)
 */
class UserService {
  /**
   * Criar novo utilizador + enviar email
   * @param {Object} User - Modelo User do Sequelize
   * @param {Object} data - { email, fullName, role, phone, address }
   * @param {string} createdByUserId - ID do admin que criou
   * @returns {Promise<Object>} - { success, user, message, error }
   */
  async createUser(User, data, createdByUserId) {
    try {
      // 1. Validações
      if (!data.email || !data.fullName || !data.role) {
        throw new Error('Email, nome e role são obrigatórios');
      }

      if (!Object.values(ROLES).includes(data.role)) {
        throw new Error(`Role inválido. Deve ser um de: ${Object.values(ROLES).join(', ')}`);
      }

      // 2. Verificar se email já existe
      const existingUser = await User.findOne({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new Error('Email já existe na BD');
      }

      // 3. Gerar password temporária
      const temporaryPassword = AuthService.generateTemporaryPassword();
      const hashedPassword = await hashPassword(temporaryPassword);

      // 4. Criar utilizador na BD
      const newUser = await User.create({
        email: data.email,
        password: hashedPassword,
        fullName: data.fullName,
        role: data.role,
        phone: data.phone || null,
        address: data.address || null,
        firstLogin: true, // Força a mudar password na primeira entrada
        isActive: true,
      });

      // 5. Enviar email com credenciais
      const emailResult = await EmailService.sendWelcomeEmail(
        newUser.email,
        newUser.fullName,
        temporaryPassword
      );

      return {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
          phone: newUser.phone,
          address: newUser.address,
          firstLogin: newUser.firstLogin,
        },
        message: `Utilizador criado com sucesso. Email enviado para ${newUser.email}`,
        emailSent: emailResult.success,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Buscar utilizador por ID
   * @param {Object} User - Modelo User
   * @param {string} userId - ID do utilizador
   * @returns {Promise<Object>} - { success, user, error }
   */
  async getUserById(User, userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] },
      });

      if (!user) {
        throw new Error('Utilizador não encontrado');
      }

      return {
        success: true,
        user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Listar todos os utilizadores com filtros
   * @param {Object} User - Modelo User
   * @param {Object} filters - { role, isActive, search }
   * @param {number} limit - Limite de resultados
   * @param {number} offset - Offset para paginação
   * @returns {Promise<Object>} - { success, users, total, error }
   */
  async listUsers(User, filters = {}, limit = 10, offset = 0) {
    try {
      const where = {};

      // Filtro por role
      if (filters.role) {
        where.role = filters.role;
      }

      // Filtro por ativo/inativo
      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      // Busca por email ou fullName
      if (filters.search) {
        const { Op } = await import('sequelize');
        where[Op.or] = [
          { email: { [Op.iLike]: `%${filters.search}%` } },
          { fullName: { [Op.iLike]: `%${filters.search}%` } },
        ];
      }

      const { rows, count } = await User.findAndCountAll({
        where,
        attributes: { exclude: ['password'] },
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      });

      return {
        success: true,
        users: rows,
        total: count,
        page: Math.floor(offset / limit) + 1,
        pages: Math.ceil(count / limit),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Atualizar dados de utilizador
   * @param {Object} User - Modelo User
   * @param {string} userId - ID do utilizador
   * @param {Object} updates - { fullName, phone, address, isActive }
   * @returns {Promise<Object>} - { success, user, message, error }
   */
  async updateUser(User, userId, updates) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error('Utilizador não encontrado');
      }

      // Apenas permitir atualizar campos específicos
      const allowedUpdates = ['fullName', 'phone', 'address', 'isActive'];
      const filteredUpdates = {};

      for (const key of allowedUpdates) {
        if (updates[key] !== undefined) {
          filteredUpdates[key] = updates[key];
        }
      }

      await user.update(filteredUpdates);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          phone: user.phone,
          address: user.address,
          isActive: user.isActive,
        },
        message: 'Utilizador atualizado com sucesso',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Desativar utilizador (soft delete)
   * @param {Object} User - Modelo User
   * @param {string} userId - ID do utilizador
   * @returns {Promise<Object>} - { success, message, error }
   */
  async deactivateUser(User, userId) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error('Utilizador não encontrado');
      }

      await user.update({ isActive: false });

      return {
        success: true,
        message: 'Utilizador desativado com sucesso',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Reativar utilizador
   * @param {Object} User - Modelo User
   * @param {string} userId - ID do utilizador
   * @returns {Promise<Object>}
   */
  async reactivateUser(User, userId) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error('Utilizador não encontrado');
      }

      await user.update({ isActive: true });

      return {
        success: true,
        message: 'Utilizador reativado com sucesso',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Resend password (admin resend credenciais)
   * @param {Object} User - Modelo User
   * @param {string} userId - ID do utilizador
   * @returns {Promise<Object>}
   */
  async resendCredentials(User, userId) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new Error('Utilizador não encontrado');
      }

      // Gerar nova password temporária
      const temporaryPassword = AuthService.generateTemporaryPassword();
      const hashedPassword = await hashPassword(temporaryPassword);

      // Atualizar na BD
      await user.update({
        password: hashedPassword,
        firstLogin: true, // De novo força a mudar na próxima entrada
      });

      // Enviar email
      const emailResult = await EmailService.sendWelcomeEmail(
        user.email,
        user.fullName,
        temporaryPassword
      );

      return {
        success: true,
        message: 'Credenciais enviadas novamente com sucesso',
        emailSent: emailResult.success,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default new UserService();
