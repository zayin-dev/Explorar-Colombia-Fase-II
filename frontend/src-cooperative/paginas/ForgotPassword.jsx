import React, { useState } from 'react'; // Importa React y el hook useState para manejar el estado del componente.
import { Link } from 'react-router-dom'; // Importa Link para la navegación declarativa (ej. 'Volver a Login').

// --- COMPONENTE ForgotPassword --- //
/**
 * @function ForgotPassword
 * @description Componente funcional que permite a los usuarios solicitar un enlace para restablecer su contraseña.
 * Muestra un formulario para ingresar el correo electrónico y maneja la comunicación con el backend.
 */
function ForgotPassword() {
    // --- ESTADOS DEL COMPONENTE --- //
    const [email, setEmail] = useState(''); // Almacena el valor del campo de correo electrónico.
    const [message, setMessage] = useState(''); // Almacena mensajes de éxito o informativos para el usuario (ej. "Enlace enviado").
    const [error, setError] = useState(''); // Almacena mensajes de error (ej. "Email no encontrado", "Error de servidor").
    const [isLoading, setIsLoading] = useState(false); // Indica si se está procesando una petición (para deshabilitar botón, mostrar spinner, etc.).

    /**
     * @async
     * @function handleSubmit
     * @description Maneja el envío del formulario de solicitud de reseteo de contraseña.
     * Valida el campo de email y envía una petición POST al backend.
     * @param {object} e - Evento del formulario (onsubmit).
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario (recarga de página).
        setMessage(''); // Limpia mensajes de éxito/informativos previos.
        setError(''); // Limpia mensajes de error previos.
        setIsLoading(true); // Activa el estado de carga.

        // Validación básica: el campo de email no debe estar vacío.
        if (!email) {
            setError('Por favor, ingrese su dirección de correo electrónico.');
            setIsLoading(false); // Desactiva el estado de carga.
            return; // Termina la ejecución de la función.
        }

        try {
            // Realiza la petición POST al endpoint 'forgot-password' del backend.
            const response = await fetch('http://localhost:3001/api/auth/forgot-password', {
                method: 'POST', // Método HTTP.
                headers: {
                    'Content-Type': 'application/json', // Indica que el cuerpo de la petición es JSON.
                },
                body: JSON.stringify({ email }), // Envía el email en formato JSON.
            });

            const data = await response.json(); // Parsea la respuesta JSON del servidor.

            if (!response.ok) { // Si la respuesta del servidor NO es exitosa (ej. status 400, 404, 500).
                // Por seguridad, para evitar la enumeración de correos electrónicos (saber si un email está registrado o no),
                // a menudo se muestra un mensaje genérico incluso si el servidor da un error específico.
                // Aquí, usamos el mensaje del servidor si existe, o uno por defecto.
                setError(data.message || 'Ocurrió un error. Por favor, inténtelo de nuevo.');
                setMessage(''); // Asegura que no se muestre ningún mensaje de éxito.
            } else { // Si la respuesta del servidor es exitosa (ej. status 200).
                // Muestra el mensaje de éxito del servidor o uno genérico.
                setMessage(data.message || 'Si su correo electrónico está registrado, se ha enviado un enlace para restablecer la contraseña.');
                setEmail(''); // Limpia el campo de email después de una solicitud exitosa.
                setError(''); // Limpia cualquier mensaje de error previo.
            }
        } catch (err) {
            // Si ocurre un error en la comunicación con el servidor (ej. red caída, servidor no responde).
            console.error('Falló la solicitud de olvido de contraseña:', err); // Loguea el error en la consola del navegador.
            setError('No se pudo conectar al servidor. Verifique su conexión e inténtelo de nuevo.');
            setMessage(''); // Asegura que no se muestre ningún mensaje de éxito.
        }
        setIsLoading(false); // Desactiva el estado de carga, independientemente del resultado de la petición.
    };

    // --- RENDERIZADO DEL COMPONENTE --- //
    // Estilos en línea simples para demostración. En una aplicación real, se usarían clases CSS o Styled Components.
    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
            <h2>¿Olvidaste tu contraseña?</h2>
            <p>Ingresa tu dirección de correo electrónico a continuación y te enviaremos un enlace para restablecer tu contraseña.</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {/* Input para el correo electrónico */}
                <input
                    type="email"
                    placeholder="Ingrese su correo electrónico"
                    value={email} // Valor controlado por el estado `email`.
                    onChange={(e) => setEmail(e.target.value)} // Actualiza el estado `email` al cambiar el input.
                    required // Atributo HTML5 para validación básica del navegador.
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                {/* Botón para enviar el formulario */}
                <button 
                    type="submit" 
                    disabled={isLoading} // El botón se deshabilita si `isLoading` es true.
                    style={{
                        padding: '10px 15px',
                        backgroundColor: isLoading ? '#ccc' : '#007bff', // Cambia el color si está cargando.
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isLoading ? 'not-allowed' : 'pointer' // Cambia el cursor si está cargando.
                    }}
                >
                    {/* Cambia el texto del botón si `isLoading` es true. */}
                    {isLoading ? 'Enviando...' : 'Enviar enlace de reseteo'}
                </button>
            </form>
            {/* Muestra el mensaje de éxito/informativo si existe. */}
            {message && <p style={{ color: 'green', marginTop: '15px' }}>{message}</p>}
            {/* Muestra el mensaje de error si existe. */}
            {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
            {/* Enlace para volver a la página de inicio de sesión. */}
            <div style={{ marginTop: '20px' }}>
                <Link to="/login">Volver a Iniciar Sesión</Link>
            </div>
        </div>
    );
}

export default ForgotPassword; // Exporta el componente para su uso en la configuración de rutas (App.jsx).
