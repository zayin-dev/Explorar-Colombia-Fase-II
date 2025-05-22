// Este archivo contiene la configuración para la conexión a la base de datos y el secreto para JWT.
// Es crucial mantener esta información segura, especialmente en un entorno de producción.
// Considera usar variables de entorno para los datos sensibles en producción.

module.exports = {
  // HOST: Dirección del servidor de la base de datos (ej. 'localhost' para desarrollo local).
  HOST: "localhost",

  // USER: Nombre de usuario para la conexión a la base de datos.
  USER: "admin",

  // PASSWORD: Contraseña para el usuario de la base de datos.
  // ¡IMPORTANTE! Esta contraseña nunca debe ser hardcodeada en producción.
  // Utiliza variables de entorno o un sistema de gestión de secretos.
  PASSWORD: "0123",

  // DB: Nombre de la base de datos a la que se conectará la aplicación.
  DB: "webapp_db",

  // JWT_SECRET: Clave secreta utilizada para firmar y verificar los JSON Web Tokens (JWT).
  // Debe ser una cadena larga, compleja y única para tu aplicación.
  // ¡IMPORTANTE! Mantén este secreto seguro y no lo expongas públicamente.
  // En producción, este valor también debería provenir de una variable de entorno.
  JWT_SECRET: "your-very-secure-and-long-jwt-secret-key"
};
