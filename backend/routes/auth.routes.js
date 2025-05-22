const express = require('express'); 
const router = express.Router();    
const authController = require('../controllers/auth.controller.js'); 
const { verifyToken } = require('../middleware/authJwt.js'); 

// --- RUTAS DE AUTENTICACIÓN --- //
// Todas las rutas definidas aquí tendrán el prefijo '/api/auth' (configurado en index.js o app.js)

// Ruta para el registro de nuevos usuarios (NUEVA)
// POST /api/auth/register
// Público: Cualquiera puede intentar registrarse.
router.post('/register', authController.register);

// POST /api/auth/login - Iniciar sesión de un usuario.
// El controlador 'authController.login' se encargará de verificar las credenciales.
router.post('/login', authController.login);

// POST /api/auth/forgot-password - Solicitar restablecimiento de contraseña.
// El controlador 'authController.forgotPassword' generará un token y (usualmente) enviará un email.
router.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/reset-password/:token - Restablecer la contraseña usando un token.
// El ':token' es un parámetro en la URL que se usa para verificar la solicitud de restablecimiento.
// El controlador 'authController.resetPassword' validará el token y actualizará la contraseña.
router.post('/reset-password/:token', authController.resetPassword);

// --- RUTAS DE PERFIL DE USUARIO (PROTEGIDAS) --- //
// Estas rutas requieren que el usuario esté autenticado (token válido).

// PUT /api/auth/profile/username - Actualizar el nombre de usuario del usuario autenticado.
// Protegida por verifyToken: solo el usuario logueado puede cambiar su propio username.
router.put('/profile/username', [verifyToken], authController.updateUsername);

// PUT /api/auth/profile/email - Actualizar el email del usuario autenticado.
// Protegida por verifyToken: solo el usuario logueado puede cambiar su propio email.
// Considerar: Añadir un paso de verificación para el nuevo email.
router.put('/profile/email', [verifyToken], authController.updateEmail);

// PUT /api/auth/profile/password - Actualizar la contraseña del usuario autenticado.
// Protegida por verifyToken: solo el usuario logueado puede cambiar su propia contraseña.
// Requerirá la contraseña actual para confirmación.
router.put('/profile/password', [verifyToken], authController.updatePassword);

module.exports = router; 
