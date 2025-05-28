import React from 'react'; // Importa React para la creación de componentes.
import { Navigate, Outlet } from 'react-router-dom'; // Importa Navigate para redirecciones y Outlet para renderizar rutas anidadas.

// --- COMPONENTE AdminRoute --- //
/**
 * @function AdminRoute
 * @description Componente de Ruta Protegida para Administradores.
 * Verifica si el usuario está autenticado y si tiene el rol de 'admin'.
 * Si no está autenticado, redirige a la página de login ('/login').
 * Si está autenticado pero no es admin, muestra una alerta y redirige al panel general ('/panel').
 * Si está autenticado y es admin, permite el acceso a la ruta anidada (renderiza <Outlet />).
 */
function AdminRoute() {
    // Verifica si el usuario está marcado como 'logueado' en localStorage.
    const isAuthenticated = localStorage.getItem('loggedIn') === 'true';
    // Obtiene la cadena de texto del usuario desde localStorage.
    const userString = localStorage.getItem('user');
    let user = null; // Variable para almacenar el objeto usuario parseado.
    let isAdmin = false; // Flag para indicar si el usuario es administrador.

    // Si existe información del usuario en localStorage, intenta parsearla.
    if (userString) {
        try {
            user = JSON.parse(userString); // Parsea la cadena JSON a un objeto JavaScript.
            // Verifica si el objeto usuario existe y si su propiedad 'role' es 'admin'.
            if (user && user.role === 'admin') {
                isAdmin = true; // El usuario es administrador.
            }
        } catch (error) {
            // Si hay un error al parsear (ej. JSON corrupto), lo muestra en consola.
            console.error('Error al parsear datos de usuario desde localStorage:', error);
            // Consideración: Se podría limpiar localStorage aquí si los datos están corruptos para evitar problemas futuros.
            // localStorage.removeItem('user');
            // localStorage.removeItem('loggedIn');
        }
    }

    // Primer chequeo: ¿Está el usuario autenticado?
    if (!isAuthenticated) {
        // Si no está autenticado, redirige a la página de login.
        // `replace` evita que esta ruta de redirección se añada al historial del navegador.
        return <Navigate to="/login" replace />;
    }

    // Segundo chequeo: ¿Es el usuario un administrador?
    // Este chequeo solo se realiza si isAuthenticated es true.
    if (!isAdmin) {
        // Si está autenticado pero NO es admin:
        // Muestra una alerta simple indicando acceso denegado.
        alert('Acceso Denegado: Esta área es solo para administradores.'); 
        // Redirige al panel general (o podría ser a una página específica de 'Acceso Denegado').
        return <Navigate to="/panel" replace />;
    }

    // Si el usuario está autenticado Y es un administrador:
    // Renderiza el componente hijo correspondiente a la ruta anidada (definido en App.jsx).
    return <Outlet />;
}

export default AdminRoute; // Exporta el componente para su uso en la configuración de rutas.
