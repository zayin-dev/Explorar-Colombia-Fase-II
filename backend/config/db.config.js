
// --- CONFIGURACIÓN DE LA BASE DE DATOS --- //

// Este archivo contiene la configuración para la conexión a la base de datos y un token para JWT.

require('dotenv').config();

module.exports = {
  // HOST: Dirección del servidor de la base de datos
  HOST: process.env.DB_HOST,

  // USER: Nombre de usuario para la conexión a la base de datos
  USER: process.env.DB_USER,

  // PASSWORD: Contraseña del usuario (admin) en XAMPP
  PASSWORD: process.env.DB_PASSWORD,

  // DB: Nombre de la base de datos a la que se conectará la aplicación
  DB: process.env.DB_NAME,

  // JWT_SECRET: Clave secreta utilizada para firmar y verificar los JSON Web Tokens (JWT).
  JWT_SECRET: process.env.JWT_SECRET
};
