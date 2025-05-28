import React, { useState } from 'react'; // Importa React y el hook useState para manejar el estado del componente.
import { Modal, Button, Form, Alert } from 'react-bootstrap'; // Importa componentes de React Bootstrap para la UI del modal y alertas.
import { useNavigate, Link } from 'react-router-dom'; // Importa useNavigate para la navegación programática y Link para enlaces declarativos.

// --- COMPONENTE Register --- //
/**
 * @function Register
 * @description Componente funcional que renderiza un modal para el registro de nuevos usuarios.
 */
function Register() {
  // --- ESTADOS DEL COMPONENTE --- //
  const [show, setShow] = useState(true); // Controla la visibilidad del modal de registro. `true` por defecto para mostrarlo al cargar.
  const [formData, setFormData] = useState({ // Almacena los datos del formulario de registro.
    username: '', // Nombre de usuario ingresado.
    email: '', // Correo electrónico ingresado.
    password: '', // Contraseña ingresada.
    confirmPassword: '', // Confirmación de la contraseña ingresada.
  });
  const [error, setError] = useState(''); // Almacena mensajes de error del formulario o de la API para mostrar al usuario.
  const [success, setSuccess] = useState(''); // Almacena mensajes de éxito después de un registro satisfactorio.
  const [isLoading, setIsLoading] = useState(false); // Indica si se está procesando una petición de registro (para deshabilitar el botón, mostrar spinner, etc.).
  const navigate = useNavigate(); // Hook para permitir la navegación programática a otras rutas.

  /**
   * @function handleClose
   * @description Cierra el modal de registro y redirige al usuario a la página de inicio ('/').
   */
  const handleClose = () => {
    setShow(false); // Oculta el modal.
    navigate('/'); // Redirige a la página principal.
  };

  /**
   * @function handleChange
   * @description Actualiza el estado del objeto `formData` cada vez que el usuario escribe en alguno de los campos del formulario.
   * Utiliza el atributo `name` del input para saber qué propiedad de `formData` actualizar.
   * @param {object} e - Evento del input (onchange).
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Actualiza la propiedad correspondiente del estado `formData`.
  };

  /**
   * @async
   * @function handleSubmit
   * @description Maneja el envío del formulario de registro cuando el usuario hace clic en "Crear cuenta".
   * Realiza validaciones básicas de los campos y luego envía una petición POST al backend para registrar al usuario.
   * @param {object} e - Evento del formulario (onsubmit).
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (que recargaría la página).
    setError(''); // Limpia cualquier mensaje de error previo.
    setSuccess(''); // Limpia cualquier mensaje de éxito previo.
    setIsLoading(true); // Activa el estado de carga.

    // Validaciones básicas de los campos del formulario.
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Todos los campos son obligatorios.'); // Muestra error si algún campo está vacío.
      setIsLoading(false); // Desactiva el estado de carga.
      return; // Termina la ejecución de la función.
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.'); // Muestra error si las contraseñas no son iguales.
      setIsLoading(false); // Desactiva el estado de carga.
      return; // Termina la ejecución de la función.
    }

    try {
      // Realiza la petición POST al endpoint de registro del backend.
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST', // Método HTTP.
        headers: {
          'Content-Type': 'application/json', // Indica que el cuerpo de la petición es JSON.
        },
        // Convierte los datos del formulario (excepto confirmPassword) a formato JSON para el cuerpo de la petición.
        body: JSON.stringify({ 
          username: formData.username, 
          email: formData.email, 
          password: formData.password 
        }),
      });

      const data = await response.json(); // Parsea la respuesta JSON del servidor.

      if (response.ok) { // Si la respuesta del servidor es exitosa (ej. status 201 Created).
        setSuccess(data.message || '¡Registro exitoso! Ahora puedes iniciar sesión.'); // Muestra mensaje de éxito.
        // Limpia el formulario después de un registro exitoso.
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        // Opcional: Redirigir al usuario a la página de login después de un breve retraso.
        // setTimeout(() => navigate('/login'), 3000); 
      } else {
        // Si la respuesta no es OK (ej. usuario ya existe, error de validación del servidor), muestra el mensaje de error del servidor.
        setError(data.message || 'Error en el registro. Intente de nuevo.');
      }
    } catch (err) {
      // Si ocurre un error en la comunicación con el servidor (ej. red caída, servidor no responde).
      console.error('Error en la llamada API de registro:', err); // Loguea el error en la consola del navegador.
      setError('No se pudo conectar al servidor. Verifique su conexión e inténtelo de nuevo.'); // Muestra un error genérico al usuario.
    } finally {
      setIsLoading(false); // Desactiva el estado de carga, independientemente del resultado de la petición.
    }
  };

  // --- RENDERIZADO DEL COMPONENTE --- //
  return (
    // Modal de React Bootstrap para el formulario de registro.
    // `backdrop="static"` y `keyboard={false}` evitan que el modal se cierre al hacer clic fuera o presionar Escape.
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton> {/* Cabecera del modal con título y botón de cierre (X). */}
        <Modal.Title>Crear cuenta</Modal.Title>
      </Modal.Header>
      <Modal.Body> {/* Cuerpo del modal donde se encuentra el formulario. */}
        <Form onSubmit={handleSubmit}> {/* Formulario que llama a `handleSubmit` al enviarse. */}
          {/* Muestra una alerta de error si el estado `error` tiene un mensaje. */}
          {error && <Alert variant="danger">{error}</Alert>}
          {/* Muestra una alerta de éxito si el estado `success` tiene un mensaje. */}
          {success && <Alert variant="success">{success}</Alert>}

          {/* Campo para el nombre de usuario */}
          <Form.Group className="mb-3" controlId="registerUsername">
            <Form.Label>Nombre de usuario</Form.Label>
            <Form.Control
              type="text"
              name="username" // Es importante para que `handleChange` sepa qué campo actualizar.
              placeholder="Elija un nombre de usuario"
              value={formData.username} // Valor controlado por el estado `formData.username`.
              onChange={handleChange} // Llama a `handleChange` cuando el valor del campo cambia.
              required // Atributo HTML5 para validación básica del navegador.
            />
          </Form.Group>

          {/* Campo para el correo electrónico */}
          <Form.Group className="mb-3" controlId="registerEmail">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Ingrese su email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Campo para la contraseña */}
          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Cree una contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Campo para confirmar la contraseña */}
          <Form.Group className="mb-3" controlId="registerConfirmPassword">
            <Form.Label>Confirmar contraseña</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirme su contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Botón para enviar el formulario de registro */}
          <div className="d-grid"> {/* `d-grid` hace que el botón ocupe todo el ancho disponible. */}
            <Button variant="primary" type="submit" disabled={isLoading}>
              {/* Cambia el texto del botón y lo deshabilita si `isLoading` es true. */}
              {isLoading ? 'Registrando...' : 'Crear cuenta'}
            </Button>
          </div>
        </Form>
        {/* Enlace para ir a la página de inicio de sesión si el usuario ya tiene una cuenta. */}
        <div className="text-center mt-3">
          <p>¿Ya tienes una cuenta? <Link to="/login" onClick={() => setShow(false)}>Inicia sesión aquí</Link></p>
          {/* `onClick={() => setShow(false)}` cierra el modal de registro antes de navegar a /login. */}
        </div>
      </Modal.Body>
      <Modal.Footer> {/* Pie del modal. */}
        {/* Botón para cerrar el modal, llama a `handleClose`. */}
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Register; // Exporta el componente para su uso en otras partes de la aplicación (ej. en App.jsx para las rutas).
