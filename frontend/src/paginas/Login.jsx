import React, { useState } from 'react'; // Importa React y el hook useState para manejar el estado del componente.
import { Modal, Button, Form } from 'react-bootstrap'; // Importa componentes de React Bootstrap para la UI del modal.
import { useNavigate, Link } from 'react-router-dom'; // Importa useNavigate para la navegación programática y Link para enlaces declarativos.

// --- COMPONENTE Login --- //
/**
 * @function Login
 * @description Componente funcional que renderiza un modal para el inicio de sesión de usuarios.
 * @param {object} props - Propiedades del componente.
 * @param {function} props.onLogin - Callback que se ejecuta después del intento de login, indicando éxito o fracaso.
 */
function Login({ onLogin }) {
  // --- ESTADOS DEL COMPONENTE --- //
  const [show, setShow] = useState(true); // Controla la visibilidad del modal de login. `true` por defecto para mostrarlo al cargar.
  const [usuario, setUsuario] = useState(''); // Almacena el valor del campo de nombre de usuario.
  const [clave, setClave] = useState(''); // Almacena el valor del campo de contraseña.
  const navigate = useNavigate(); // Hook para permitir la navegación a otras rutas.
  const [error, setError] = useState(''); // Almacena mensajes de error que se mostrarán al usuario.

  // --- MANEJADORES DE EVENTOS Y FUNCIONES --- //

  /**
   * @function handleClose
   * @description Cierra el modal de login y redirige al usuario a la página de inicio ('/').
   */
  const handleClose = () => {
    setShow(false); // Oculta el modal.
    navigate('/'); // Redirige a la página principal.
  };

  /**
   * @async
   * @function handleLogin
   * @description Maneja el proceso de inicio de sesión.
   * Envía las credenciales al backend, procesa la respuesta y actualiza el estado de la aplicación.
   */
  const handleLogin = async () => {
    setError(''); // Limpia cualquier error previo antes de un nuevo intento.
    try {
      // Realiza la petición POST al endpoint de login del backend.
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indica que el cuerpo de la petición es JSON.
        },
        // Convierte las credenciales a formato JSON para el cuerpo de la petición.
        body: JSON.stringify({ username: usuario, password: clave }),
      });

      const data = await response.json(); // Parsea la respuesta JSON del servidor.

      if (response.ok) { // Si la respuesta del servidor es exitosa (ej. status 200).
        // Almacena el token de acceso y los datos del usuario en localStorage.
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify({ id: data.id, username: data.username, email: data.email, role: data.role, profile_image: data.profile_image }));
        localStorage.setItem('loggedIn', 'true'); // Indica que el usuario ha iniciado sesión.

        // Ejecuta el callback onLogin (si se proporcionó) indicando éxito.
        if (typeof onLogin === 'function') {
          onLogin(true);
        }
        navigate('/panel'); // Redirige al usuario al panel de administración o dashboard.
      } else {
        // Si la respuesta no es OK (ej. credenciales incorrectas), muestra el mensaje de error del servidor.
        setError(data.message || 'Error al iniciar sesión. Intente de nuevo.');
        // Ejecuta el callback onLogin (si se proporcionó) indicando fracaso.
        if (typeof onLogin === 'function') {
          onLogin(false);
        }
      }
    } catch (err) {
      // Si ocurre un error en la comunicación con el servidor (ej. red caída).
      console.error('Error en la llamada API de login:', err);
      setError('No se pudo conectar al servidor. Verifique su conexión.');
      // Ejecuta el callback onLogin (si se proporcionó) indicando fracaso.
      if (typeof onLogin === 'function') {
        onLogin(false);
      }
    }
  };

  // --- RENDERIZADO DEL COMPONENTE --- //
  return (
    // Modal de React Bootstrap para el formulario de login.
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Iniciar sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Campo para el nombre de usuario */}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese su usuario"
              value={usuario} // Valor controlado por el estado 'usuario'.
              onChange={(e) => setUsuario(e.target.value)} // Actualiza el estado 'usuario' al cambiar el input.
            />
          </Form.Group>

          {/* Campo para la contraseña */}
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Contraseña"
              value={clave} // Valor controlado por el estado 'clave'.
              onChange={(e) => setClave(e.target.value)} // Actualiza el estado 'clave' al cambiar el input.
            />
          </Form.Group>
          {/* Enlaces para recuperar contraseña y registrarse */}
          <div className="mb-3 text-end">
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </div>
          <div className="mb-3 text-center">
            <span>¿No tienes una cuenta? </span>
            <Link to="/register" onClick={() => setShow(false)}>Regístrate aquí</Link>
          </div>
          {/* Muestra mensajes de error si existen */}
          {error && <p className="text-danger">{error}</p>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* Botón para cerrar el modal */}
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        {/* Botón para enviar el formulario de login */}
        <Button variant="primary" onClick={handleLogin}>
          Iniciar sesión
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Login; // Exporta el componente para su uso en otras partes de la aplicación.