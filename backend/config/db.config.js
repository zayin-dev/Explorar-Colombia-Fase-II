
// --- CONFIGURACIÓN DE LA BASE DE DATOS --- //

// Este archivo contiene la configuración para la conexión a la base de datos y un token para JWT.

module.exports = {
  // HOST: Dirección del servidor de la base de datos
  // Como la base de datos es local, se usa localhost
  HOST: "localhost",

  // USER: Nombre de usuario para la conexión a la base de datos
  // Este ususario debe existir en XAMPP
  USER: "admin",

  // PASSWORD: Contraseña del usuario (admin) en XAMPP
  PASSWORD: "0123",

  // DB: Nombre de la base de datos a la que se conectará la aplicación
  // La base de datos tendra este nombre al crearla con el script db_setup.js
  DB: "webapp_db",

  // JWT_SECRET: Clave secreta utilizada para firmar y verificar los JSON Web Tokens (JWT).
  // Debe ser una cadena larga, compleja y única para tu aplicación.
  // En producción, este valor también debería provenir de una variable de entorno.
  JWT_SECRET: "your-very-secure-and-long-jwt-secret-key"
};
