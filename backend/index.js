const express = require('express'); // Framework para construir aplicaciones web y APIs en Node.js
const cors = require('cors');    // Middleware para habilitar Cross-Origin Resource Sharing (CORS)
const app = express();           // Crea una instancia de la aplicación Express
const port = 3001;               // Puerto en el que el servidor backend escuchará las peticiones

// --- IMPORTACIÓN DE RUTAS --- //
// Importa los módulos de rutas definidos en otros archivos.
const userRoutes = require('./routes/user.routes'); // Rutas para la gestión de usuarios
const authRoutes = require('./routes/auth.routes'); // Rutas para la autenticación

// --- MIDDLEWARE --- //
// app.use() se utiliza para montar funciones de middleware.

// Habilita CORS para todas las rutas y orígenes.
// Esto permite que tu frontend (ej. React en localhost:5173) haga peticiones a este backend (localhost:3001).
app.use(cors()); 

// Parsea las solicitudes entrantes con payloads JSON.
// Transforma el cuerpo JSON de la solicitud en un objeto JavaScript accesible a través de `req.body`.
app.use(express.json()); 

// --- SERVIR ARCHIVOS ESTÁTICOS --- //
// Permite acceder a los archivos subidos (imágenes, multimedia, etc.) desde la carpeta 'public/uploads'.
// Ejemplo: http://localhost:3001/uploads/archivo.jpg
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
// --- RUTA DE PRUEBA --- //
// Una ruta simple para verificar que el servidor está funcionando.
// GET http://localhost:3001/
app.get('/', (req, res) => {
  res.send('¡Hola Mundo desde el Backend!'); // Envía una respuesta de texto simple.
});

// --- MONTAJE DE RUTAS --- //
// Monta los módulos de rutas importados en prefijos de ruta específicos.
// Todas las rutas definidas en 'userRoutes' estarán bajo '/api/users'.
// Ejemplo: una ruta GET '/' en userRoutes se convertirá en GET '/api/users/'.
app.use('/api/users', userRoutes);

// Todas las rutas definidas en 'authRoutes' estarán bajo '/api/auth'.
// Ejemplo: una ruta POST '/login' en authRoutes se convertirá en POST '/api/auth/login'.
app.use('/api/auth', authRoutes);

// --- INICIO DEL SERVIDOR --- //
// Inicia el servidor y lo pone a escuchar en el puerto especificado.
app.listen(port, () => {
  // Mensaje que se muestra en la consola cuando el servidor se inicia correctamente.
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});
