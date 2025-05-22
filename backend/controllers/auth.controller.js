const mysql = require('mysql2/promise'); // Driver MySQL con promesas
const dbConfig = require('../config/db.config.js'); // Configuración de la BD
const bcrypt = require('bcryptjs'); // Para hashing de contraseñas
const jwt = require('jsonwebtoken'); // Para generar JSON Web Tokens
const crypto = require('crypto'); // Módulo crypto de Node.js para generar tokens seguros
const { sendEmail } = require('../utils/mailer.js'); // Utilidad para enviar correos electrónicos

// --- FUNCIÓN AUXILIAR --- //
// Obtiene una conexión a la base de datos.
async function getConnection() {
  return await mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
  });
}

// --- CONTROLADORES DE AUTENTICACIÓN --- //

/**
 * @function login
 * @description Autentica a un usuario y devuelve un JWT si las credenciales son válidas.
 * @param {object} req - Objeto de solicitud Express (req.body debe contener username, password).
 * @param {object} res - Objeto de respuesta Express.
 */
exports.login = async (req, res) => {
  const { username, password } = req.body; // Extrae username y password del cuerpo de la solicitud

  // Validación de campos requeridos
  if (!username || !password) {
    return res.status(400).send({ message: 'Nombre de usuario y contraseña son requeridos.' });
  }

  let connection;
  try {
    connection = await getConnection();
    // Busca al usuario por su nombre de usuario en la BD
    const sql = 'SELECT * FROM users WHERE username = ?';
    const [users] = await connection.query(sql, [username]);

    // Si no se encuentra el usuario, devuelve error 401 (No autorizado)
    if (users.length === 0) {
      return res.status(401).send({ message: 'Nombre de usuario o contraseña inválidos.' });
    }

    const user = users[0]; // Usuario encontrado
    // Compara la contraseña proporcionada con la contraseña hasheada almacenada en la BD
    const passwordIsValid = await bcrypt.compare(password, user.password);

    // Si la contraseña no es válida, devuelve error 401
    if (!passwordIsValid) {
      return res.status(401).send({ message: 'Nombre de usuario o contraseña inválidos.' });
    }

    // Si las credenciales son válidas, genera un token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role }, // Payload del token
      dbConfig.JWT_SECRET, // Secreto para firmar el token (debe estar en config)
      {
        expiresIn: 86400 // El token expira en 24 horas (en segundos)
      }
    );

    // Prepara la respuesta del usuario, excluyendo la contraseña por seguridad
    const userResponse = { ...user };
    delete userResponse.password;

    // Envía la respuesta con los datos del usuario y el token de acceso
    res.status(200).send({
      ...userResponse,
      accessToken: token
    });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).send({ message: 'Error al iniciar sesión.' });
  } finally {
    if (connection) await connection.end();
  }
};

/**
 * @function forgotPassword
 * @description Inicia el proceso de restablecimiento de contraseña. Genera un token,
 * lo guarda en la BD y envía un email al usuario con el enlace de restablecimiento.
 * @param {object} req - Objeto de solicitud Express (req.body debe contener email).
 * @param {object} res - Objeto de respuesta Express.
 */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send({ message: 'El email es requerido.' });
  }

  let connection;
  try {
    connection = await getConnection();
    // Busca al usuario por su email
    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

    // IMPORTANTE: Por seguridad, no revelar si un email está registrado o no.
    // Esto previene la enumeración de usuarios.
    if (users.length === 0) {
      console.log(`Solicitud de restablecimiento para email no existente: ${email}`);
      // Envía un mensaje genérico, igual que si el email existiera.
      return res.status(200).send({ message: 'Si su dirección de correo electrónico está registrada con nosotros, recibirá un enlace para restablecer la contraseña.' });
    }

    const user = users[0];

    // Genera un token de restablecimiento seguro y único
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Opcional: Hashear el token antes de guardarlo en BD para mayor seguridad.
    // const hashedToken = await bcrypt.hash(resetToken, 10);

    // Define la fecha de expiración del token (ej: 1 hora)
    const expires = new Date(Date.now() + 3600000); // 1 hora en milisegundos

    // Guarda el token (o su hash) y su fecha de expiración en la BD para el usuario
    await connection.execute(
      'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?',
      [resetToken, expires, user.id] // Guardar resetToken (plano) o hashedToken
    );

    // Construye la URL de restablecimiento para el frontend
    // ASEGÚRATE de que el puerto y la ruta coincidan con tu configuración de frontend
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Contenido del email de restablecimiento
    const emailSubject = 'Solicitud de Restablecimiento de Contraseña';
    const emailText = `Está recibiendo este correo porque usted (u otra persona) ha solicitado restablecer la contraseña de su cuenta.\n\n` +
                      `Por favor, haga clic en el siguiente enlace o péguelo en su navegador para completar el proceso (válido por una hora):\n\n` +
                      `${resetUrl}\n\n` +
                      `Si usted no solicitó esto, ignore este correo y su contraseña permanecerá sin cambios.\n`;
    const emailHtml = `<p>Está recibiendo este correo porque usted (u otra persona) ha solicitado restablecer la contraseña de su cuenta.</p>` +
                      `<p>Por favor, haga clic en el siguiente enlace o péguelo en su navegador para completar el proceso (válido por una hora):</p>` +
                      `<p><a href="${resetUrl}">${resetUrl}</a></p>` +
                      `<p>Si usted no solicitó esto, ignore este correo y su contraseña permanecerá sin cambios.</p>`;

    try {
      // Envía el email
      await sendEmail({
        to: user.email,
        subject: emailSubject,
        text: emailText,
        html: emailHtml
      });
      console.log(`Email de restablecimiento enviado a ${user.email}. Token: ${resetToken}`);
      // Envía el mensaje genérico al usuario
      res.status(200).send({ message: 'Si su dirección de correo electrónico está registrada con nosotros, recibirá un enlace para restablecer la contraseña.' });
    } catch (emailError) {
      console.error('Error al enviar email de restablecimiento:', emailError);
      // Incluso si el email falla, no revelar demasiada información.
      // Se podría loguear para atención administrativa.
      res.status(500).send({ message: 'Error al procesar su solicitud. Inténtelo de nuevo más tarde.' });
      // Considerar revertir el guardado del token si el envío de email es crítico y falla.
    }

  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).send({ message: 'Error al procesar su solicitud.' });
  } finally {
    if (connection) await connection.end();
  }
};

/**
 * @function resetPassword
 * @description Restablece la contraseña del usuario utilizando un token válido.
 * @param {object} req - Objeto de solicitud Express (req.params.token, req.body.password).
 * @param {object} res - Objeto de respuesta Express.
 */
exports.resetPassword = async (req, res) => {
  const { token } = req.params; // Token de la URL
  const { password } = req.body; // Nueva contraseña del cuerpo de la solicitud

  if (!password) {
    return res.status(400).send({ message: 'La nueva contraseña es requerida.' });
  }
  // Ejemplo: Validar longitud mínima de la contraseña
  if (password.length < 6) {
    return res.status(400).send({ message: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  let connection;
  try {
    connection = await getConnection();

    // Busca al usuario por el token de restablecimiento Y verifica que no haya expirado.
    // MySQL NOW() devuelve la fecha y hora actual.
    const [users] = await connection.query(
      'SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()',
      [token]
    );

    // Si no se encuentra usuario o el token expiró, devuelve error.
    if (users.length === 0) {
      return res.status(400).send({ message: 'El token de restablecimiento es inválido o ha expirado.' });
    }

    const user = users[0];

    // Hashea la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 8); // Usar un salt round consistente (ej. 8 o 10)

    // Actualiza la contraseña del usuario en la BD
    // y limpia los campos de restablecimiento de contraseña.
    await connection.execute(
      'UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    res.status(200).send({ message: '¡Contraseña restablecida exitosamente!' });

  } catch (error) {
    console.error('Error en resetPassword:', error);
    // No revelar detalles del error del token en producción por seguridad.
    res.status(500).send({ message: 'Error al restablecer la contraseña.' });
  } finally {
    if (connection) await connection.end();
  }
};

// --- NUEVA FUNCIÓN: register (Público) ---
/**
 * @async
 * @function register
 * @description Registra un nuevo usuario en el sistema.
 * @param {object} req - Objeto de solicitud Express (req.body debe contener username, email, password).
 * @param {object} res - Objeto de respuesta Express.
 */
exports.register = async (req, res) => {
  // Extrae los datos del cuerpo de la solicitud
  const { username, email, password } = req.body;

  // Validación básica de campos requeridos
  if (!username || !email || !password) {
    return res.status(400).send({ message: 'Todos los campos (nombre de usuario, email, contraseña) son obligatorios.' });
  }

  // Validación de formato de email (básica)
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!emailRegex.test(email)) {
      return res.status(400).send({ message: 'El formato del correo electrónico no es válido.' });
  }

  // Validación de longitud de contraseña (ejemplo)
  if (password.length < 6) {
      return res.status(400).send({ message: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  let connection;
  try {
    connection = await getConnection();

    // Verificar si el nombre de usuario ya existe
    let sql = 'SELECT id FROM users WHERE username = ?';
    let [existingUser] = await connection.query(sql, [username]);
    if (existingUser.length > 0) {
      return res.status(409).send({ message: 'El nombre de usuario ya está en uso. Por favor, elija otro.' }); // 409 Conflict
    }

    // Verificar si el email ya existe
    sql = 'SELECT id FROM users WHERE email = ?';
    [existingUser] = await connection.query(sql, [email]);
    if (existingUser.length > 0) {
      return res.status(409).send({ message: 'La dirección de correo electrónico ya está registrada. Por favor, utilice otra.' }); // 409 Conflict
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 8); // Usar un salt round consistente (ej. 8 o 10)

    // Insertar el nuevo usuario en la base de datos con rol 'user' por defecto
    sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
    const [result] = await connection.execute(sql, [username, email, hashedPassword, 'user']);

    // Devuelve una respuesta exitosa
    res.status(201).send({ message: '¡Usuario registrado exitosamente!', userId: result.insertId }); // 201 Created

  } catch (error) {
    console.error('Error en el registro de usuario:', error);
    res.status(500).send({ message: 'Error al registrar el usuario. Por favor, inténtelo de nuevo más tarde.' });
  } finally {
    if (connection) await connection.end();
  }
};

// --- CONTROLADORES PARA ACTUALIZACIÓN DE PERFIL DE USUARIO --- //

/**
 * @async
 * @function updateUsername
 * @description Actualiza el nombre de usuario del usuario autenticado.
 * @param {object} req - Objeto de solicitud Express (req.userId del token, req.body.username nuevo username).
 * @param {object} res - Objeto de respuesta Express.
 */
exports.updateUsername = async (req, res) => {
  const userId = req.userId; // ID del usuario autenticado (obtenido del token por el middleware verifyToken)
  const { username: newUsername } = req.body; // Nuevo nombre de usuario desde el cuerpo de la solicitud

  // Validación: el nuevo nombre de usuario no debe estar vacío
  if (!newUsername || newUsername.trim() === '') {
    return res.status(400).send({ message: 'El nuevo nombre de usuario no puede estar vacío.' });
  }

  // Validación: longitud del nombre de usuario (ejemplo)
  if (newUsername.length < 3 || newUsername.length > 30) {
    return res.status(400).send({ message: 'El nombre de usuario debe tener entre 3 y 30 caracteres.' });
  }

  let connection;
  try {
    connection = await getConnection();

    // Opcional: Verificar si el nuevo nombre de usuario ya está en uso por OTRO usuario
    const [existingUser] = await connection.query(
      'SELECT id FROM users WHERE username = ? AND id != ?',
      [newUsername, userId]
    );
    if (existingUser.length > 0) {
      return res.status(409).send({ message: 'Este nombre de usuario ya está en uso por otra cuenta.' }); // 409 Conflict
    }

    // Actualizar el nombre de usuario en la base de datos
    const sql = 'UPDATE users SET username = ? WHERE id = ?';
    const [result] = await connection.execute(sql, [newUsername, userId]);

    if (result.affectedRows === 0) {
      // Esto no debería ocurrir si el userId del token es válido y existe
      return res.status(404).send({ message: 'Usuario no encontrado para actualizar.' });
    }

    res.status(200).send({ message: 'Nombre de usuario actualizado exitosamente.', username: newUsername });

  } catch (error) {
    console.error('Error al actualizar nombre de usuario:', error);
    res.status(500).send({ message: 'Error interno al actualizar el nombre de usuario.' });
  } finally {
    if (connection) await connection.end();
  }
};

/**
 * @async
 * @function updateEmail
 * @description Actualiza el email del usuario autenticado.
 * @param {object} req - Objeto de solicitud Express (req.userId del token, req.body.email nuevo email).
 * @param {object} res - Objeto de respuesta Express.
 */
exports.updateEmail = async (req, res) => {
  const userId = req.userId;
  const { email: newEmail } = req.body;

  if (!newEmail || newEmail.trim() === '') {
    return res.status(400).send({ message: 'El nuevo email no puede estar vacío.' });
  }

  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!emailRegex.test(newEmail)) {
      return res.status(400).send({ message: 'El formato del nuevo correo electrónico no es válido.' });
  }

  let connection;
  try {
    connection = await getConnection();

    // Opcional: Verificar si el nuevo email ya está en uso por OTRO usuario
    const [existingUser] = await connection.query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [newEmail, userId]
    );
    if (existingUser.length > 0) {
      return res.status(409).send({ message: 'Esta dirección de correo electrónico ya está en uso por otra cuenta.' });
    }

    // Actualizar el email en la base de datos
    // Consideración: Para producción, se podría marcar el email como no verificado
    // y enviar un correo de confirmación al nuevo email.
    const sql = 'UPDATE users SET email = ? WHERE id = ?'; // , email_verified = false (si se implementa verificación)
    const [result] = await connection.execute(sql, [newEmail, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Usuario no encontrado para actualizar.' });
    }

    res.status(200).send({ message: 'Email actualizado exitosamente.', email: newEmail });
    // Si se implementa verificación de email: { message: 'Email actualizado. Por favor, verifique su nueva dirección de correo.' }

  } catch (error) {
    console.error('Error al actualizar email:', error);
    res.status(500).send({ message: 'Error interno al actualizar el email.' });
  } finally {
    if (connection) await connection.end();
  }
};

/**
 * @async
 * @function updatePassword
 * @description Actualiza la contraseña del usuario autenticado después de verificar la actual.
 * @param {object} req - Objeto de solicitud Express (req.userId del token, req.body.currentPassword, req.body.newPassword).
 * @param {object} res - Objeto de respuesta Express.
 */
exports.updatePassword = async (req, res) => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).send({ message: 'La contraseña actual y la nueva contraseña son requeridas.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).send({ message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
  }

  if (currentPassword === newPassword) {
    return res.status(400).send({ message: 'La nueva contraseña no puede ser igual a la contraseña actual.' });
  }

  let connection;
  try {
    connection = await getConnection();

    // Obtener la contraseña actual del usuario para verificarla
    const [users] = await connection.query('SELECT password FROM users WHERE id = ?', [userId]);

    if (users.length === 0) {
      // No debería suceder si el token es válido
      return res.status(404).send({ message: 'Usuario no encontrado.' });
    }
    const user = users[0];

    // Verificar la contraseña actual
    const passwordIsValid = await bcrypt.compare(currentPassword, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: 'La contraseña actual es incorrecta.' }); // 401 Unauthorized o 400 Bad Request
    }

    // Hashear la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, 8);

    // Actualizar la contraseña en la base de datos
    const sql = 'UPDATE users SET password = ? WHERE id = ?';
    await connection.execute(sql, [hashedNewPassword, userId]);

    res.status(200).send({ message: 'Contraseña actualizada exitosamente.' });

  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    res.status(500).send({ message: 'Error interno al actualizar la contraseña.' });
  } finally {
    if (connection) await connection.end();
  }
};
