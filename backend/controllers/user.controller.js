const mysql = require('mysql2/promise'); // Importa el driver de MySQL con promesas
const dbConfig = require('../config/db.config.js'); // Importa la configuración de la base de datos
const bcrypt = require('bcryptjs'); // Importa bcrypt para el hashing de contraseñas

// --- FUNCIÓN AUXILIAR --- //
// Función para obtener una conexión a la base de datos.
// Utiliza la configuración de db.config.js.
async function getConnection() {
  return await mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
  });
}

// --- CONTROLADORES DE USUARIO --- //

/**
 * @function uploadProfileImage
 * @description Sube una imagen de perfil para el usuario y actualiza su campo profile_image.
 * @param {object} req - Objeto de solicitud Express (req.file contiene el archivo de imagen, req.params.id el ID de usuario).
 * @param {object} res - Objeto de respuesta Express.
 */
exports.uploadProfileImage = async (req, res) => {
  console.log('[uploadProfileImage] req.userId:', req.userId, 'req.role:', req.role, 'req.params.id:', req.params.id, 'req.file:', req.file);

  const userId = req.params.id;
  // Verifica que se haya subido un archivo
  if (!req.file) {
    return res.status(400).send({ message: 'No se ha subido ninguna imagen.' });
  }
  // Construye la URL relativa para guardar en la base de datos
  const imageUrl = `/uploads/${req.file.filename}`;
  let connection;
  try {
    connection = await getConnection();
    // Actualiza el campo profile_image del usuario
    const sql = 'UPDATE users SET profile_image = ? WHERE id = ?';
    const [result] = await connection.execute(sql, [imageUrl, userId]);
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Usuario no encontrado.' });
    }
    res.status(200).send({ message: 'Imagen de perfil actualizada correctamente.', profile_image: imageUrl });
  } catch (error) {
    console.error('Error al subir imagen de perfil:', error);
    res.status(500).send({ message: 'Error al subir la imagen de perfil.' });
  } finally {
    if (connection) await connection.end();
  }
};

/**
 * @function createUser
 * @description Crea un nuevo usuario en la base de datos.
 * Hashea la contraseña antes de guardarla.
 * @param {object} req - Objeto de solicitud Express (req.body debe contener username, password, email).
 * @param {object} res - Objeto de respuesta Express.
 */
exports.createUser = async (req, res) => {
  // Extrae username, password y email del cuerpo de la solicitud
  const { username, password, email } = req.body;

  // Validación básica de campos requeridos
  if (!username || !password || !email) {
    return res.status(400).send({ message: 'Nombre de usuario, contraseña y email son requeridos.' });
  }

  let connection;
  try {
    connection = await getConnection(); // Obtiene una conexión a la BD
    // Hashea la contraseña proporcionada por el usuario antes de almacenarla
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Consulta SQL para insertar el nuevo usuario
    const sql = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    // Ejecuta la consulta con los datos del usuario (usando la contraseña hasheada)
    const [result] = await connection.execute(sql, [username, hashedPassword, email]);
    
    // Envía una respuesta exitosa (201 Created) con el ID del nuevo usuario y sus datos (sin la contraseña)
    res.status(201).send({ id: result.insertId, username, email });
  } catch (error) {
    // Manejo de error específico para entradas duplicadas (username o email ya existen)
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).send({ message: 'El nombre de usuario o el email ya existen.' });
    }
    console.error('Error al crear usuario:', error); // Loguea el error en la consola del servidor
    // Envía una respuesta de error genérica (500 Internal Server Error)
    res.status(500).send({ message: 'Error al crear el usuario.' });
  } finally {
    // Asegura que la conexión a la BD se cierre, tanto si hubo éxito como si hubo error
    if (connection) await connection.end();
  }
};

/**
 * @function getAllUsers
 * @description Obtiene todos los usuarios de la base de datos.
 * Excluye la contraseña de los datos devueltos.
 * @param {object} req - Objeto de solicitud Express.
 * @param {object} res - Objeto de respuesta Express.
 */
exports.getAllUsers = async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    // Consulta SQL para seleccionar todos los usuarios, excluyendo la contraseña por seguridad
    const sql = 'SELECT id, username, email, role, profile_image, created_at FROM users';
    const [users] = await connection.query(sql);
    // Envía la lista de usuarios con un estado 200 OK
    res.status(200).send(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).send({ message: 'Error al obtener los usuarios.' });
  } finally {
    if (connection) await connection.end();
  }
};

/**
 * @function getUserById
 * @description Obtiene un usuario específico por su ID.
 * Excluye la contraseña de los datos devueltos.
 * @param {object} req - Objeto de solicitud Express (req.params.id contiene el ID del usuario).
 * @param {object} res - Objeto de respuesta Express.
 */
exports.getUserById = async (req, res) => {
  const userId = req.params.id; // Obtiene el ID del usuario de los parámetros de la ruta
  let connection;
  try {
    connection = await getConnection();
    // Consulta SQL para seleccionar un usuario por ID, excluyendo la contraseña
    const sql = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
    const [users] = await connection.query(sql, [userId]);

    // Si no se encuentra ningún usuario con ese ID, devuelve 404 Not Found
    if (users.length === 0) {
      return res.status(404).send({ message: 'Usuario no encontrado.' });
    }
    // Envía los datos del usuario encontrado
    res.status(200).send(users[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).send({ message: 'Error al obtener el usuario.' });
  } finally {
    if (connection) await connection.end();
  }
};

/**
 * @function updateUser
 * @description Actualiza los datos de un usuario existente (username, email, password).
 * Si se proporciona una nueva contraseña, se hashea antes de guardarla.
 * @param {object} req - Objeto de solicitud Express (req.params.id, req.body puede contener username, email, password).
 * @param {object} res - Objeto de respuesta Express.
 */
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  // Extrae los campos actualizables del cuerpo de la solicitud
  const { username, password, email } = req.body;

  // Verifica que al menos un campo para actualizar sea proporcionado
  if (!username && !password && !email) {
    return res.status(400).send({ message: 'No se proporcionaron campos para actualizar.' });
  }

  let connection;
  try {
    connection = await getConnection();
    
    // Construye la consulta SQL dinámicamente basada en los campos proporcionados
    let sql = 'UPDATE users SET ';
    const params = []; // Array para los valores de los parámetros de la consulta

    if (username) {
      sql += 'username = ?, ';
      params.push(username);
    }
    if (email) {
      sql += 'email = ?, ';
      params.push(email);
    }
    if (password) {
      // Si se actualiza la contraseña, se hashea
      const hashedPassword = await bcrypt.hash(password, 10);
      sql += 'password = ?, ';
      params.push(hashedPassword);
    }

    sql = sql.slice(0, -2); // Elimina la última coma y espacio (', ')
    sql += ' WHERE id = ?'; // Añade la condición WHERE para el ID del usuario
    params.push(userId);

    // Ejecuta la consulta de actualización
    const [result] = await connection.execute(sql, params);

    // Si ninguna fila fue afectada, significa que el usuario no fue encontrado
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Usuario no encontrado o sin cambios realizados.' });
    }
    
    // Obtiene y devuelve los datos actualizados del usuario (excluyendo la contraseña)
    const [updatedUsers] = await connection.query('SELECT id, username, email, created_at FROM users WHERE id = ?', [userId]);
    res.status(200).send(updatedUsers[0]);

  } catch (error) {
    // Manejo de error para entradas duplicadas (username o email)
     if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).send({ message: 'El nombre de usuario o el email ya existen en otra cuenta.' });
    }
    console.error('Error al actualizar usuario:', error);
    res.status(500).send({ message: 'Error al actualizar el usuario.' });
  } finally {
    if (connection) await connection.end();
  }
};

/**
 * @function deleteUser
 * @description Elimina un usuario de la base de datos por su ID.
 * @param {object} req - Objeto de solicitud Express (req.params.id contiene el ID del usuario).
 * @param {object} res - Objeto de respuesta Express.
 */
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  let connection;
  try {
    connection = await getConnection();
    // Consulta SQL para eliminar un usuario por ID
    const sql = 'DELETE FROM users WHERE id = ?';
    const [result] = await connection.execute(sql, [userId]);

    // Si ninguna fila fue afectada, el usuario no fue encontrado
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Usuario no encontrado.' });
    }
    // Envía una respuesta exitosa. Se puede usar 204 No Content si no se devuelve cuerpo.
    res.status(200).send({ message: 'Usuario eliminado exitosamente.' }); 
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).send({ message: 'Error al eliminar el usuario.' });
  } finally {
    if (connection) await connection.end();
  }
};
