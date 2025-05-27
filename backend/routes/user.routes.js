const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js'); // Importa el controlador de usuarios
const { verifyToken, isAdmin } = require('../middleware/authJwt'); // Importa los middlewares de autenticación y autorización
const uploadImage = require('../middleware/uploadImage'); // Middleware para subida de imágenes
const canEditOwnProfile = require('../middleware/canEditOwnProfile'); // Permite que el usuario o admin suban imagen

// --- RUTAS DE USUARIOS --- //
// Todas las rutas definidas aquí tendrán el prefijo '/api/users' (configurado en index.js o app.js)

// RUTA PÚBLICA (o para registro inicial si se ajusta el controlador)
// POST /api/users - Crear un nuevo usuario.
// Actualmente, esta ruta es pública. Si la creación de usuarios solo debe ser por admins,
// se debería añadir [verifyToken, isAdmin] como middleware.
router.post('/', userController.createUser);

// RUTAS PROTEGIDAS (requieren token y rol de administrador)

// GET /api/users - Obtener todos los usuarios.
// Protegida: Solo administradores pueden acceder.
router.get('/', [verifyToken, isAdmin], userController.getAllUsers);

// GET /api/users/:id - Obtener un usuario específico por su ID.
// Protegida: Solo administradores pueden acceder.
router.get('/:id', [verifyToken, isAdmin], userController.getUserById);

// PUT /api/users/:id - Actualizar un usuario específico por su ID.
// Protegida: Solo administradores pueden acceder.
router.put('/:id', [verifyToken, isAdmin], userController.updateUser);

// PUT /api/users/:id/profile-image - Subir imagen de perfil de usuario
// Protegida: Solo el usuario autenticado o un admin pueden acceder (aquí solo admin por consistencia actual)
// Se recomienda adaptar el middleware para permitir que el propio usuario suba su imagen
router.put('/:id/profile-image', [verifyToken, canEditOwnProfile, uploadImage.single('profile_image')], userController.uploadProfileImage);

module.exports = router; // Exporta el router para ser usado en la aplicación principal
