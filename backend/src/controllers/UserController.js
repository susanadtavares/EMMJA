import { validationResult } from 'express-validator';
import db from '../config/db.js';
import UserService from '../services/UserService.js';

const { User } = db.models;

/**
 * UserController
 * 
 * Endpoints para gestão de utilizadores:
 * - POST /api/users - Criar novo utilizador (admin only)
 * - GET /api/users - Listar utilizadores (admin only)
 * - GET /api/users/:id - Ver detalhes de utilizador
 * - PUT /api/users/:id - Atualizar utilizador
 * - DELETE /api/users/:id - Desativar utilizador (admin only)
 * - POST /api/users/:id/reactivate - Reativar utilizador (admin only)
 * - POST /api/users/:id/resend-credentials - Enviar credenciais novamente (admin only)
 */

export const createUser = async (req, res) => {
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

    const { email, fullName, role, phone, address } = req.body;
    const createdByUserId = req.user.id; // Do middleware authMiddleware

    // Chamar UserService
    const result = await UserService.createUser(
      User,
      { email, fullName, role, phone, address },
      createdByUserId
    );

    if (result.success) {
      return res.status(201).json({
        success: true,
        message: result.message,
        user: result.user,
        emailSent: result.emailSent,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Erro em createUser:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno ao criar utilizador',
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await UserService.getUserById(User, id);

    if (result.success) {
      return res.status(200).json({
        success: true,
        user: result.user,
      });
    } else {
      return res.status(404).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Erro em getUser:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno ao buscar utilizador',
    });
  }
};

export const listUsers = async (req, res) => {
  try {
    const { role, isActive, search, page = 1, limit = 10 } = req.query;

    const filters = {};
    if (role) filters.role = role;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (search) filters.search = search;

    const offset = (page - 1) * limit;

    const result = await UserService.listUsers(
      User,
      filters,
      parseInt(limit),
      offset
    );

    if (result.success) {
      return res.status(200).json({
        success: true,
        users: result.users,
        pagination: {
          total: result.total,
          page: result.page,
          pages: result.pages,
          limit: parseInt(limit),
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Erro em listUsers:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno ao listar utilizadores',
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, address, isActive } = req.body;

    const result = await UserService.updateUser(User, id, {
      fullName,
      phone,
      address,
      isActive,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        user: result.user,
      });
    } else {
      return res.status(404).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Erro em updateUser:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno ao atualizar utilizador',
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se não é o próprio utilizador
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        error: 'Não pode desativar a sua própria conta',
      });
    }

    const result = await UserService.deactivateUser(User, id);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } else {
      return res.status(404).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Erro em deleteUser:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno ao desativar utilizador',
    });
  }
};

export const reactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await UserService.reactivateUser(User, id);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } else {
      return res.status(404).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Erro em reactivateUser:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno ao reativar utilizador',
    });
  }
};

export const resendCredentials = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await UserService.resendCredentials(User, id);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        emailSent: result.emailSent,
      });
    } else {
      return res.status(404).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Erro em resendCredentials:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno ao resend credenciais',
    });
  }
};

export default {
  createUser,
  getUser,
  listUsers,
  updateUser,
  deleteUser,
  reactivateUser,
  resendCredentials,
};
