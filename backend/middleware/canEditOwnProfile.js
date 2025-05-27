// Middleware para permitir que solo el propio usuario o un admin puedan editar el perfil
const { verifyToken, isAdmin } = require('./authJwt');

/**
 * Permite acceso si el usuario autenticado es admin o es el mismo que el :id de la ruta
 */
module.exports = async function canEditOwnProfile(req, res, next) {
  try {
    // Para depuración:
    console.log('[canEditOwnProfile] req.userId:', req.userId, 'req.role:', req.role, 'req.params.id:', req.params.id);
    const userId = Number(req.userId);
    const paramId = Number(req.params.id);
    // Si es admin, permitir
    if (req.role && req.role === 'admin') return next();
    // Si el usuario autenticado es el mismo que el del perfil, permitir
    if (!isNaN(userId) && !isNaN(paramId) && userId === paramId) return next();
    return res.status(403).json({ message: 'No tienes permisos para modificar este perfil.' });
  } catch (err) {
    console.error('[canEditOwnProfile] Error:', err);
    return res.status(500).json({ message: 'Error de autorización.' });
  }
};
