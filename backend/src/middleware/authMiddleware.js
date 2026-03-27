import AuthService from '../services/AuthService.js';

/**
 * authMiddleware
 * 
 * Middleware para validar JWT tokens
 * Extrai o token do header Authorization: Bearer <token>
 * Valida o token e adiciona req.user com { id, email, role }
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Verificar se header existe
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Token não fornecido',
      });
    }

    // Extrair token do header "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        error: 'Formato de token inválido. Use: Bearer <token>',
      });
    }

    const token = parts[1];

    // Validar token
    const decoded = AuthService.verifyJWT(token);

    if (!decoded.success) {
      return res.status(401).json({
        success: false,
        error: decoded.error || 'Token inválido',
      });
    }

    // Adicionar dados do utilizador ao req
    req.user = {
      id: decoded.payload.id,
      email: decoded.payload.email,
      role: decoded.payload.role,
    };

    next();
  } catch (error) {
    console.error('Erro em authMiddleware:', error);
    res.status(401).json({
      success: false,
      error: 'Erro na validação de token',
    });
  }
};

/**
 * roleMiddleware
 * 
 * Middleware para verificar se utilizador tem uma role específica
 * Uso: roleMiddleware('admin') ou roleMiddleware('admin', 'docente')
 * 
 * Deve ser usado DEPOIS de authMiddleware
 */
export const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Autenticação necessária',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Acesso negado. Roles permitidos: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
};

/**
 * Verificadores de role (helper functions)
 */
export const isAdmin = roleMiddleware('admin');
export const isDocente = roleMiddleware('docente');
export const isAluno = roleMiddleware('aluno');
export const isTeacherOrAdmin = roleMiddleware('docente', 'admin');

export default { authMiddleware, roleMiddleware, isAdmin, isDocente, isAluno, isTeacherOrAdmin };
