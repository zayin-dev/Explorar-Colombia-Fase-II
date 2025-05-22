const jwt = require('jsonwebtoken'); // Para verificar JSON Web Tokens
const dbConfig = require('../config/db.config.js'); // Importa la configuración, principalmente para JWT_SECRET

// --- MIDDLEWARE: verifyToken --- //
/**
 * @function verifyToken
 * @description Middleware para verificar la validez de un token JWT.
 * Extrae el token del encabezado 'Authorization' (formato 'Bearer <token>').
 * Si el token es válido, decodifica su contenido (id, username, role) y lo añade al objeto `req`.
 * Llama a `next()` para pasar el control al siguiente middleware o controlador.
 * Si el token no existe, es inválido o ha expirado, envía una respuesta de error.
 * @param {object} req - Objeto de solicitud Express.
 * @param {object} res - Objeto de respuesta Express.
 * @param {function} next - Función callback para pasar al siguiente middleware.
 */
const verifyToken = (req, res, next) => {
  // Intenta obtener el token del encabezado 'Authorization', que es el estándar.
  let token = req.headers['authorization'];

  // Si no se encuentra en 'Authorization', como fallback, intenta con 'x-access-token'.
  // Aunque 'Authorization: Bearer <token>' es la práctica más común.
  if (!token) {
    token = req.headers['x-access-token']; 
  }

  // Si no se proporciona ningún token, devuelve un error 403 (Prohibido).
  if (!token) {
    return res.status(403).send({ message: '¡No se proporcionó ningún token!' });
  }

  // Si el token viene con el prefijo 'Bearer ', se extrae solo el token.
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length); // Elimina 'Bearer '
  }

  // Verifica el token usando el secreto configurado.
  jwt.verify(token, dbConfig.JWT_SECRET, (err, decoded) => {
    // Si hay un error en la verificación (ej. firma inválida, token malformado).
    if (err) {
      // Si el error es porque el token ha expirado.
      if (err.name === 'TokenExpiredError') {
        return res.status(401).send({ message: '¡No autorizado! El token ha expirado.' });
      }
      // Para otros errores de token (inválido, etc.).
      return res.status(401).send({ message: '¡No autorizado! Token inválido.' });
    }
    // Si el token es válido, el objeto 'decoded' contiene el payload del token.
    // Se añaden los datos decodificados al objeto 'req' para que estén disponibles
    // en los siguientes middlewares o controladores de ruta.
    req.userId = decoded.id;       // ID del usuario
    req.username = decoded.username; // Nombre de usuario (opcional, pero útil)
    req.role = decoded.role;       // Rol del usuario
    next(); // Pasa el control al siguiente middleware/controlador.
  });
};

// --- MIDDLEWARE: isAdmin --- //
/**
 * @function isAdmin
 * @description Middleware para verificar si el usuario autenticado tiene el rol de 'admin'.
 * Este middleware DEBE usarse DESPUÉS de `verifyToken`, ya que depende de `req.role`.
 * Si el usuario es admin, llama a `next()`.
 * Si no es admin, envía una respuesta de error 403 (Prohibido).
 * @param {object} req - Objeto de solicitud Express (debe tener `req.role` establecido por `verifyToken`).
 * @param {object} res - Objeto de respuesta Express.
 * @param {function} next - Función callback para pasar al siguiente middleware.
 */
const isAdmin = (req, res, next) => {
  // Se asume que `verifyToken` ya se ejecutó y estableció `req.role`.
  if (req.role && req.role === 'admin') {
    next(); // El usuario es admin, continuar.
    return;
  }
  // Si no tiene el rol de 'admin', devuelve un error 403.
  res.status(403).send({ message: '¡Requiere Rol de Administrador!' });
  // Ya no se necesita conexión a la base de datos aquí, el rol viene del token.
};

// Objeto que agrupa los middlewares para exportarlos.
const authJwt = {
  verifyToken,
  isAdmin,
};

module.exports = authJwt; // Exporta los middlewares.
