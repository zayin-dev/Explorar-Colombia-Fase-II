// middleware/uploadImage.js
// Middleware para manejar la subida de archivos (imágenes de perfil) usando multer

const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    // Renombrar archivo: userID-timestamp.extensión
    const userId = req.params.id || 'user';
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    cb(null, `${userId}-${timestamp}${ext}`);
  }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen.'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
