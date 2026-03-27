import express from 'express';
import { body } from 'express-validator';
import AuthController from '../controllers/AuthController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * 
 * Fazer login
 * 
 * Request body:
 * {
 *   "email": "admin@escola.pt",
 *   "password": "sua_password"
 * }
 * 
 * Response: { success, token, user, firstLogin }
 */
router.post(
  '/login',
  [
    body('email')
      .notEmpty().withMessage('Email é obrigatório')
      .isEmail().withMessage('Email inválido'),
    body('password')
      .notEmpty().withMessage('Password é obrigatória')
      .isLength({ min: 1 }).withMessage('Password é obrigatória'),
  ],
  AuthController.login
);

/**
 * POST /api/auth/change-password
 * 
 * Mudar password (requer autenticação)
 * 
 * Header: Authorization: Bearer <token>
 * 
 * Request body:
 * {
 *   "oldPassword": "password_atual",
 *   "newPassword": "nova_password"
 * }
 * 
 * Response: { success, message }
 */
router.post(
  '/change-password',
  authMiddleware,
  [
    body('oldPassword')
      .notEmpty().withMessage('Password atual é obrigatória'),
    body('newPassword')
      .notEmpty().withMessage('Nova password é obrigatória')
      .isLength({ min: 6 }).withMessage('Nova password deve ter no mínimo 6 caracteres')
      .custom((value, { req }) => value !== req.body.oldPassword)
      .withMessage('Nova password deve ser diferente da atual'),
  ],
  AuthController.changePassword
);

/**
 * GET /api/auth/me
 * 
 * Obter dados do utilizador autenticado (requer autenticação)
 * 
 * Header: Authorization: Bearer <token>
 * 
 * Response: { success, user }
 */
router.get('/me', authMiddleware, AuthController.getCurrentUser);

export default router;
