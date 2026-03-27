import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { comparePassword, hashPassword } from '../utils/helpers.js';

/**
 * AuthService
 * 
 * Serviço centralizado para autenticação:
 * - Login (gera JWT)
 * - Password change (força no primeiro login)
 * - Validar JWT
 * - Refresh token
 */
class AuthService {
  /**
   * Login do utilizador
   * @param {Object} User - Modelo User do Sequelize
   * @param {string} email - Email do utilizador
   * @param {string} password - Password em texto plano
   * @returns {Promise<Object>} - { token, user, mustChangePassword }
   */
  async login(User, email, password) {
    try {
      // 1. Buscar utilizador por email
      const user = await User.findOne({
        where: { email },
        attributes: { exclude: ['password'] }, // Não trazer password na resposta
      });

      if (!user) {
        throw new Error('Email ou password incorreto');
      }

      // 2. Actualizar password hash guardado na BD
      const storedPassword = await User.findOne({
        where: { email },
        attributes: ['password'],
        raw: true,
      });

      // 3. Comparar passwords
      const passwordMatch = await comparePassword(password, storedPassword.password);
      if (!passwordMatch) {
        throw new Error('Email ou password incorreto');
      }

      // 4. Gerar JWT token
      const token = this.generateJWT(user);

      // 5. Indicar se deve mudar password na primeira entrada
      const mustChangePassword = user.firstLogin === true;

      return {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          firstLogin: user.firstLogin,
        },
        mustChangePassword,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Gera JWT token
   * @param {Object} user - Objeto do utilizador (com id, email, role)
   * @returns {string} - JWT token
   */
  generateJWT(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || '7d',
      }
    );
  }

  /**
   * Valida JWT token
   * @param {string} token - JWT token do header
   * @returns {Object} - { success, payload, error }
   */
  verifyJWT(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return {
        success: true,
        payload: decoded,
      };
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Muda a password do utilizador
   * @param {Object} User - Modelo User
   * @param {string} userId - ID do utilizador
   * @param {string} oldPassword - Password antiga
   * @param {string} newPassword - Nova password
   * @returns {Promise<Object>} - { success, message }
   */
  async changePassword(User, userId, oldPassword, newPassword) {
    try {
      // 1. Buscar utilizador
      const user = await User.findByPk(userId, {
        attributes: ['id', 'password', 'email'],
      });

      if (!user) {
        throw new Error('Utilizador não encontrado');
      }

      // 2. Validar password antiga
      const passwordMatch = await comparePassword(oldPassword, user.password);
      if (!passwordMatch) {
        throw new Error('Password actual incorreta');
      }

      // 3. Hash da nova password
      const hashedNewPassword = await hashPassword(newPassword);

      // 4. Atualizar na BD
      await user.update(
        {
          password: hashedNewPassword,
          firstLogin: false, // Marca como não sendo primeira entrada
        },
        { fields: ['password', 'firstLogin'] }
      );

      return {
        success: true,
        message: 'Password alterada com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Gera password temporária para admin criar utilizadores
   * @returns {string} - Password de 12 caracteres
   */
  generateTemporaryPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}

export default new AuthService();
