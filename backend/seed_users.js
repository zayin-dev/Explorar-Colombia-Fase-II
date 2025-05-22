const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dbConfig = require('./config/db.config.js');

const usersToSeed = [
  {
    username: 'adminuser',
    password: 'Password123!', // Plain text password, will be hashed
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    username: 'testuser1',
    password: 'TestPassword1@',
    email: 'test1@example.com',
    role: 'user'
  },
  {
    username: 'testuser2',
    password: 'TestPassword2@',
    email: 'test2@example.com',
    role: 'user'
  }
];

async function seedUsers() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: dbConfig.HOST,
      user: dbConfig.USER,
      password: dbConfig.PASSWORD,
      database: dbConfig.DB
    });

    console.log('Connected to the database.');

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await connection.execute(createUsersTable);
    console.log('Users table checked/created.');

    for (const userData of usersToSeed) {
      const { username, password, email, role } = userData;
      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        const sql = 'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)';
        const [result] = await connection.execute(sql, [username, hashedPassword, email, role]);
        console.log(`User '${username}' created with ID: ${result.insertId} and role '${role}'`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.warn(`User '${username}' or email '${email}' already exists. Checking role...`);
          const [existingUsers] = await connection.query('SELECT id, role FROM users WHERE username = ? OR email = ?', [username, email]);
          if (existingUsers.length > 0 && existingUsers[0].role !== role) {
            await connection.execute('UPDATE users SET role = ? WHERE id = ?', [role, existingUsers[0].id]);
            console.log(`Updated role for user '${username}' to '${role}'.`);
          }
        } else {
          console.error(`Error creating user '${username}':`, error.message);
        }
      }
    }

    console.log('User seeding process completed.');

  } catch (error) {
    console.error('Error during user seeding:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
}

seedUsers();
