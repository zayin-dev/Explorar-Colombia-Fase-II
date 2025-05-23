// --- Script de inicialización de la base de datos ---
// Este archivo crea la base de datos y las tablas necesarias para la aplicación.
// ATENCIÓN: Este script elimina todas las tablas y datos existentes, úsalo solo en desarrollo.

const mysql = require('mysql2/promise'); // Importa el cliente MySQL con soporte para promesas
const dbConfig = require('./config/db.config.js'); // Configuración de conexión (host, usuario, contraseña, nombre de BD)

// Función principal que inicializa la base de datos y las tablas
async function initializeDatabase() {
  let connection;
  try {
    // 1. Conexión inicial al servidor MySQL (sin especificar base de datos)
    connection = await mysql.createConnection({
      host: dbConfig.HOST,
      user: dbConfig.USER,
      password: dbConfig.PASSWORD
    });

    // 2. Crear la base de datos si no existe
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.DB}\``);
    console.log(`Database '${dbConfig.DB}' created or already exists.`);
    
    // 3. Cerrar la conexión inicial y reconectar, ahora especificando la base de datos
    await connection.end();
    connection = await mysql.createConnection({
      host: dbConfig.HOST,
      user: dbConfig.USER,
      password: dbConfig.PASSWORD,
      database: dbConfig.DB
    });
    console.log(`Successfully connected to database '${dbConfig.DB}'.`);

    // 4. Eliminar tablas existentes (¡Destructivo! Borra todos los datos)
    // Se eliminan en orden inverso de dependencias para evitar errores por claves foráneas
    await connection.query('DROP TABLE IF EXISTS product_categories;'); // Tabla de relación muchos a muchos
    console.log("Table 'product_categories' dropped if it existed.");
    await connection.query('DROP TABLE IF EXISTS products;'); // Productos
    console.log("Table 'products' dropped if it existed.");
    await connection.query('DROP TABLE IF EXISTS categories;'); // Categorías
    console.log("Table 'categories' dropped if it existed.");
    await connection.query('DROP TABLE IF EXISTS users;'); // Usuarios
    console.log("Table 'users' dropped if it existed.");

    // 5. Crear tablas necesarias para la aplicación
    // Tabla de usuarios: almacena datos de autenticación y perfil

    /**
     * Tabla de usuarios: almacena datos de autenticación y perfil
     * CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY, // Identificador único
        username VARCHAR(255) NOT NULL UNIQUE, // Nombre de usuario único
        password VARCHAR(255) NOT NULL, // Contraseña (hash)
        email VARCHAR(255) NOT NULL UNIQUE, // Email único
        role VARCHAR(50) NOT NULL DEFAULT 'user', // Rol del usuario
        reset_password_token VARCHAR(255) NULL, // Token para recuperación de contraseña
        reset_password_expires DATETIME NULL, // Expiración del token
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP // Fecha de creación
      )
    */
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        username VARCHAR(255) NOT NULL UNIQUE, 
        password VARCHAR(255) NOT NULL, 
        email VARCHAR(255) NOT NULL UNIQUE, 
        role VARCHAR(50) NOT NULL DEFAULT 'user', 
        reset_password_token VARCHAR(255) NULL, 
        reset_password_expires DATETIME NULL, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
      )
    `;
    await connection.query(createUsersTable);
    console.log("Table 'users' created.");

    // Tabla de categorías: almacena las categorías de productos
    /*
    CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY, // Identificador único
        name VARCHAR(255) NOT NULL UNIQUE, // Nombre de la categoría
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP // Fecha de creación
      )
    */
    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        name VARCHAR(255) NOT NULL UNIQUE, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
      )
    `;
    await connection.query(createCategoriesTable);
    console.log("Table 'categories' created or already exists.");

    // Tabla de productos: almacena los productos de la tienda o sistema

    /*
    CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY, // Identificador único
        name VARCHAR(255) NOT NULL, // Nombre del producto
        description TEXT, // Descripción
        price DECIMAL(10, 2), // Precio
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP // Fecha de creación
      )
    */
    const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        name VARCHAR(255) NOT NULL, 
        description TEXT, 
        price DECIMAL(10, 2), 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
      )
    `;
    await connection.query(createProductsTable);
    console.log("Table 'products' created or already exists.");

    // Tabla de relación muchos a muchos entre productos y categorías
    /*
    CREATE TABLE IF NOT EXISTS product_categories (
        product_id INT, // ID del producto
        category_id INT, // ID de la categoría
        PRIMARY KEY (product_id, category_id), // Clave primaria compuesta
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE, // FK a productos
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE // FK a categorías
      )
    */
    const createProductCategoriesTable = `
      CREATE TABLE IF NOT EXISTS product_categories (
        product_id INT, 
        category_id INT, 
        PRIMARY KEY (product_id, category_id), 
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE, 
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE 
      )
    `;
    await connection.query(createProductCategoriesTable);
    console.log("Table 'product_categories' created or already exists.");

  } catch (error) {
    // Manejo de errores: muestra el error y termina el proceso con código de error
    console.error('Error initializing database and tables:', error);
    process.exit(1); // Exit with error code
  } finally {
    // Asegura que la conexión se cierre aunque ocurra un error
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
} // Fin de la función initializeDatabase

// Llamada a la función principal para iniciar el proceso de inicialización
initializeDatabase();
