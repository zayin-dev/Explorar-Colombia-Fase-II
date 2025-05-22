const mysql = require('mysql2/promise');
const dbConfig = require('./config/db.config.js');

async function initializeDatabase() {
  let connection;
  try {
    // Connection to MySQL server (without specifying a database initially)
    connection = await mysql.createConnection({
      host: dbConfig.HOST,
      user: dbConfig.USER,
      password: dbConfig.PASSWORD
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.DB}\``);
    console.log(`Database '${dbConfig.DB}' created or already exists.`);
    
    // Close initial connection and reconnect to the specific database
    await connection.end();
    connection = await mysql.createConnection({
      host: dbConfig.HOST,
      user: dbConfig.USER,
      password: dbConfig.PASSWORD,
      database: dbConfig.DB
    });
    console.log(`Successfully connected to database '${dbConfig.DB}'.`);

    // Drop tables in reverse order of dependency (or if no strict FKs, any order is fine for IF EXISTS)
    // Assuming product_categories might depend on products and categories
    await connection.query('DROP TABLE IF EXISTS product_categories;');
    console.log("Table 'product_categories' dropped if it existed.");
    await connection.query('DROP TABLE IF EXISTS products;');
    console.log("Table 'products' dropped if it existed.");
    await connection.query('DROP TABLE IF EXISTS categories;');
    console.log("Table 'categories' dropped if it existed.");
    await connection.query('DROP TABLE IF EXISTS users;');
    console.log("Table 'users' dropped if it existed.");

    // Create tables
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

    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await connection.query(createCategoriesTable);
    console.log("Table 'categories' created or already exists.");

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
    console.error('Error initializing database and tables:', error);
    process.exit(1); // Exit with error code
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

initializeDatabase();
