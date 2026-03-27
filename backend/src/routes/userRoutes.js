import express from 'express';
import { body } from 'express-validator';
import UserController from '../controllers/UserController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';
import { ROLES } from '../utils/constants.js';

const router = express.Router();

/**
 * POST /api/users
 * 
 * Criar novo utilizador + enviar email com credenciais
 * (Admin only)
 * 
 * Header: Authorization: Bearer <token_admin>
 * 
 * Request body:
 * {
 *   "email": "novo@escola.pt",
 *   "fullName": "João Silva",
 *   "role": "aluno" | "docente" | "admin",
 *   "phone": "912345678",
 *   "address": "Rua X, Lisboa"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Utilizador criado com sucesso...",
 *   "user": { id, email, fullName, role, ... },
 *   "emailSent": true
 * }
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin'),
  [
    body('email')
      .notEmpty().withMessage('Email é obrigatório')
      .isEmail().withMessage('Email inválido'),
    body('fullName')
      .notEmpty().withMessage('Nome completo é obrigatório')
      .isLength({ min: 3 }).withMessage('Nome deve ter no mínimo 3 caracteres'),
    body('role')
      .notEmpty().withMessage('Role é obrigatória')
      .isIn(Object.values(ROLES)).withMessage(`Role deve ser um de: ${Object.values(ROLES).join(', ')}`),
    body('phone')
      .optional()
      .isMobilePhone().withMessage('Telefone inválido'),
    body('address')
      .optional()
      .isLength({ min: 3 }).withMessage('Morada deve ter no mínimo 3 caracteres'),
  ],
  UserController.createUser
);

/**
 * GET /api/users
 * 
 * Listar utilizadores com filtros
 * (Admin only)
 * 
 * Header: Authorization: Bearer <token_admin>
 * 
 * Query params:
 * - role: admin | docente | aluno
 * - isActive: true | false
 * - search: nome ou email
 * - page: número da página (default: 1)
 * - limit: resultados por página (default: 10)
 * 
 * Response:
 * {
 *   "success": true,
 *   "users": [...],
 *   "pagination": { total, page, pages, limit }
 * }
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware('admin'),
  UserController.listUsers
);

/**
 * GET /api/users/:id
 * 
 * Obter detalhes de um utilizador
 * (Admin ou próprio utilizador)
 * 
 * Header: Authorization: Bearer <token>
 * 
 * Response: { success, user: { id, email, fullName, role, ... } }
 */
router.get(
  '/:id',
  authMiddleware,
  UserController.getUser
);

/**
 * PUT /api/users/:id
 * 
 * Atualizar dados de utilizador
 * (Admin ou próprio utilizador)
 * 
 * Header: Authorization: Bearer <token>
 * 
 * Request body:
 * {
 *   "fullName": "Novo Nome",
 *   "phone": "987654321",
 *   "address": "Nova morada",
 *   "isActive": true | false
 * }
 * 
 * Response: { success, message, user }
 */
router.put(
  '/:id',
  authMiddleware,
  [
    body('fullName')
      .optional()
      .isLength({ min: 3 }).withMessage('Nome deve ter no mínimo 3 caracteres'),
    body('phone')
      .optional()
      .isMobilePhone().withMessage('Telefone inválido'),
    body('address')
      .optional()
      .isLength({ min: 3 }).withMessage('Morada deve ter no mínimo 3 caracteres'),
    body('isActive')
      .optional()
      .isBoolean().withMessage('isActive deve ser true ou false'),
  ],
  UserController.updateUser
);

/**
 * DELETE /api/users/:id
 * 
 * Desativar utilizador
 * (Admin only. Não pode deletar a si próprio)
 * 
 * Header: Authorization: Bearer <token_admin>
 * 
 * Response: { success, message }
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('admin'),
  UserController.deleteUser
);

/**
 * POST /api/users/:id/reactivate
 * 
 * Reativar utilizador desativado
 * (Admin only)
 * 
 * Header: Authorization: Bearer <token_admin>
 * 
 * Response: { success, message }
 */
router.post(
  '/:id/reactivate',
  authMiddleware,
  roleMiddleware('admin'),
  UserController.reactivateUser
);

/**
 * POST /api/users/:id/resend-credentials
 * 
 * Reenviar email com credenciais (gera nova password temporária)
 * (Admin only)
 * 
 * Header: Authorization: Bearer <token_admin>
 * 
 * Response: { success, message, emailSent }
 */
router.post(
  '/:id/resend-credentials',
  authMiddleware,
  roleMiddleware('admin'),
  UserController.resendCredentials
);

export default router;
