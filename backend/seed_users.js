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

    // --- Datos de prueba para categorías de destinos turísticos ---
    const categoriesToSeed = [
      { name: 'Playa' },
      { name: 'Montaña' },
      { name: 'Ciudad' },
      { name: 'Parque Nacional' }
    ];
    for (const cat of categoriesToSeed) {
      try {
        const sql = 'INSERT INTO destination_categories (name) VALUES (?)';
        await connection.execute(sql, [cat.name]);
        console.log(`Categoría '${cat.name}' insertada.`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.warn(`La categoría '${cat.name}' ya existe.`);
        } else {
          console.error(`Error insertando categoría '${cat.name}':`, error.message);
        }
      }
    }

    // --- Datos de prueba para destinos turísticos ---
    const destinationsToSeed = [
      {
        name: 'Cartagena',
        description: 'Ciudad amurallada y destino turístico en la costa Caribe.',
        location: 'Cartagena, Bolívar',
        image_url: 'https://ejemplo.com/cartagena.jpg'
      },
      {
        name: 'Parque Tayrona',
        description: 'Parque Nacional Natural con playas y selva.',
        location: 'Santa Marta, Magdalena',
        image_url: 'https://ejemplo.com/tayrona.jpg'
      },
      {
        name: 'Medellín',
        description: 'Ciudad de la eterna primavera.',
        location: 'Medellín, Antioquia',
        image_url: 'https://ejemplo.com/medellin.jpg'
      }
    ];
    for (const dest of destinationsToSeed) {
      try {
        const sql = 'INSERT INTO destinations (name, description, location, image_url) VALUES (?, ?, ?, ?)';
        await connection.execute(sql, [dest.name, dest.description, dest.location, dest.image_url]);
        console.log(`Destino '${dest.name}' insertado.`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.warn(`El destino '${dest.name}' ya existe.`);
        } else {
          console.error(`Error insertando destino '${dest.name}':`, error.message);
        }
      }
    }

    // --- Relacionar destinos con categorías ---
    // Nota: Esto asume que los nombres son únicos y que las inserciones anteriores funcionaron
    const destinationCategoryRelations = [
      // Cartagena: Playa, Ciudad
      { destination: 'Cartagena', categories: ['Playa', 'Ciudad'] },
      // Parque Tayrona: Playa, Parque Nacional
      { destination: 'Parque Tayrona', categories: ['Playa', 'Parque Nacional'] },
      // Medellín: Ciudad
      { destination: 'Medellín', categories: ['Ciudad'] }
    ];
    for (const rel of destinationCategoryRelations) {
      // Obtener IDs de destino y categorías
      const [destRows] = await connection.execute('SELECT id FROM destinations WHERE name = ?', [rel.destination]);
      if (destRows.length === 0) continue;
      const destId = destRows[0].id;
      for (const catName of rel.categories) {
        const [catRows] = await connection.execute('SELECT id FROM destination_categories WHERE name = ?', [catName]);
        if (catRows.length === 0) continue;
        const catId = catRows[0].id;
        try {
          const sql = 'INSERT INTO destination_category_rel (destination_id, category_id) VALUES (?, ?)';
          await connection.execute(sql, [destId, catId]);
          console.log(`Destino '${rel.destination}' relacionado con categoría '${catName}'.`);
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            console.warn(`La relación entre '${rel.destination}' y '${catName}' ya existe.`);
          } else {
            console.error(`Error relacionando '${rel.destination}' con '${catName}':`, error.message);
          }
        }
      }
    }
    console.log('Datos de prueba de destinos y categorías insertados.');

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
