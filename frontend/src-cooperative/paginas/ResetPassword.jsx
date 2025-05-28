import React, { useState } from 'react'; // Importa React y el hook useState para el manejo del estado.
import { useParams, useNavigate, Link } from 'react-router-dom'; // Importa hooks y componentes de React Router DOM:
// - useParams: para acceder a los parámetros de la URL (ej. el token de reseteo).
// - useNavigate: para la navegación programática (ej. redirigir al login).
// - Link: para la navegación declarativa.

// --- COMPONENTE ResetPassword --- //
/**
 * @function ResetPassword
 * @description Componente que permite a un usuario establecer una nueva contraseña utilizando un token de reseteo.
 * El token se espera como parámetro en la URL.
 */
function ResetPassword() {
    // --- HOOKS y ESTADO --- //
    const { token } = useParams(); // Extrae el parámetro 'token' de la URL (ej. /reset-password/este-es-el-token).
    const navigate = useNavigate(); // Hook para redirigir al usuario programáticamente.

    const [password, setPassword] = useState(''); // Almacena la nueva contraseña ingresada por el usuario.
    const [confirmPassword, setConfirmPassword] = useState(''); // Almacena la confirmación de la nueva contraseña.
    const [message, setMessage] = useState(''); // Para mensajes de éxito (ej. "Contraseña actualizada").
    const [error, setError] = useState(''); // Para mensajes de error (ej. "Las contraseñas no coinciden", "Token inválido").
    const [isLoading, setIsLoading] = useState(false); // Indica si se está procesando la petición de reseteo.

    /**
     * @async
     * @function handleSubmit
     * @description Maneja el envío del formulario de reseteo de contraseña.
     * Realiza validaciones y envía la nueva contraseña y el token al backend.
     * @param {object} e - Evento del formulario (onsubmit).
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene la recarga de la página.
        setMessage(''); // Limpia mensajes previos.
        setError(''); // Limpia errores previos.
        setIsLoading(true); // Inicia el estado de carga.

        // --- VALIDACIONES DEL LADO DEL CLIENTE --- //
        if (!password || !confirmPassword) { // Verifica que ambos campos estén llenos.
            setError('Por favor, ingrese y confirme su nueva contraseña.');
            setIsLoading(false);
            return;
        }
        if (password !== confirmPassword) { // Verifica que las contraseñas coincidan.
            setError('Las contraseñas no coinciden.');
            setIsLoading(false);
            return;
        }
        if (password.length < 6) { // Verifica la longitud mínima de la contraseña.
            setError('La contraseña debe tener al menos 6 caracteres.');
            setIsLoading(false);
            return;
        }

        try {
            // Realiza la petición POST al backend para resetear la contraseña.
            // El token se incluye en la URL del endpoint.
            const response = await fetch(`http://localhost:3001/api/auth/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }), // Envía solo la nueva contraseña en el cuerpo.
            });

            const data = await response.json(); // Parsea la respuesta del servidor.

            if (!response.ok) { // Si la respuesta del servidor indica un error.
                setError(data.message || 'Falló el reseteo de contraseña. El enlace puede ser inválido o haber expirado.');
            } else { // Si la contraseña se reseteó exitosamente.
                setMessage(data.message || '¡Tu contraseña ha sido restablecida exitosamente! Ahora puedes iniciar sesión.');
                // Limpia los campos y redirige al login después de un breve retraso.
                setPassword('');
                setConfirmPassword('');
                setTimeout(() => {
                    navigate('/login'); // Redirige a la página de login.
                }, 3000); // Espera 3 segundos antes de redirigir para que el usuario lea el mensaje.
            }
        } catch (err) {
            // Si hay un error de red o el servidor no responde.
            console.error('Falló la solicitud de reseteo de contraseña:', err);
            setError('No se pudo conectar al servidor. Verifique su conexión e inténtelo de nuevo.');
        }
        setIsLoading(false); // Finaliza el estado de carga, independientemente del resultado.
    };

    // --- RENDERIZADO DEL COMPONENTE --- //
    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
            <h2>Restablecer tu Contraseña</h2>
            {/* El formulario se muestra solo si no hay un mensaje de éxito. */}
            { !message && (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {/* Input para la nueva contraseña */}
                    <input
                        type="password"
                        placeholder="Ingrese nueva contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    {/* Input para confirmar la nueva contraseña */}
                    <input
                        type="password"
                        placeholder="Confirme nueva contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    {/* Botón de envío */}
                    <button 
                        type="submit" 
                        disabled={isLoading} // Deshabilitado durante la carga.
                        style={{
                            padding: '10px 15px',
                            backgroundColor: isLoading ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                    </button>
                </form>
            )}
            {/* Muestra el mensaje de éxito si existe. */}
            {message && <p style={{ color: 'green', marginTop: '15px' }}>{message}</p>}
            {/* Muestra el mensaje de error si existe. */}
            {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
            {/* Muestra un enlace a Login si hay un mensaje de éxito (después de resetear). */}
            {message && (
                <div style={{ marginTop: '20px' }}>
                    <Link to="/login">Ir a Iniciar Sesión</Link>
                </div>
            )}
        </div>
    );
}

export default ResetPassword; // Exporta el componente.
