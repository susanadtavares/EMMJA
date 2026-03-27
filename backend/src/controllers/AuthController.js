import { validationResult } from 'express-validator';
import db from '../config/db.js';
import AuthService from '../services/AuthService.js';
import bcrypt from 'bcryptjs';

const { User } = db.models;

/**
 * AuthController
 * 
 * Endpoints de autenticação:
 * - POST /api/auth/login - Fazer login
 * - POST /api/auth/change-password - Mudar password (requer auth)
 */

export const login = async (req, res) => {
  try {
    // Validar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg,
        })),
      });
    }

    const { email, password } = req.body;

    // Chamar AuthService.login()
    const result = await AuthService.login(User, email, password);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        token: result.token,
        user: {
          id: result.user.id,
          email: result.user.email,
          fullName: result.user.fullName,
          role: result.user.role,
          firstLogin: result.user.firstLogin, // Deve mudar password?
        },
        firstLogin: result.user.firstLogin, // Flag para frontend saber que deve mudar password
      });
    } else {
      return res.status(401).json({
        success: false,
        error: result.error || 'Email ou password incorretos',
      });
    }
  } catch (error) {
    console.error('Erro em login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno ao fazer login',
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    // Validar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg,
        })),
      });
    }

    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // Do middleware authMiddleware

    const result = await AuthService.changePassword(
      User,
      userId,
      oldPassword,
      newPassword
    );

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Password alterada com sucesso',
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Erro em changePassword:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno ao alterar password',
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilizador não encontrado',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        address: user.address,
        firstLogin: user.firstLogin,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Erro em getCurrentUser:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno ao buscar utilizador',
    });
  }
};

export default {
  login,
  changePassword,
  getCurrentUser,
};
