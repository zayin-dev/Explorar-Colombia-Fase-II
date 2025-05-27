import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';

// Componente principal para el panel de administración de usuarios
function AdminPanel() {
    // --- ESTADOS DEL COMPONENTE ---
    const [users, setUsers] = useState([]); // Almacena la lista de usuarios traída del backend
    const [isLoading, setIsLoading] = useState(true); // Indica si los datos de usuarios se están cargando
    const [error, setError] = useState(null); // Almacena mensajes de error generales (ej. al cargar usuarios)
    
    // Estados para el modal de CREAR usuario
    const [showCreateModal, setShowCreateModal] = useState(false); // Controla la visibilidad del modal de creación
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' }); // Datos del nuevo usuario a crear
    const [createError, setCreateError] = useState(null); // Errores específicos del modal de creación
    const [createSuccess, setCreateSuccess] = useState(null); // Mensaje de éxito para la creación

    // Estados para el modal de EDITAR usuario
    const [showEditModal, setShowEditModal] = useState(false); // Controla la visibilidad del modal de edición
    const [editingUser, setEditingUser] = useState(null); // Almacena el objeto del usuario que se está editando
    const [editFormData, setEditFormData] = useState({ id: '', username: '', email: '', role: '' }); // Datos del formulario de edición
    const [editError, setEditError] = useState(null); // Errores específicos del modal de edición
    const [editSuccess, setEditSuccess] = useState(null); // Mensaje de éxito para la edición
    const [isSelfEdit, setIsSelfEdit] = useState(false); // Indica si el admin se está editando a sí mismo (para restringir cambio de rol)

    // Estados para la operación de ELIMINAR usuario
    const [deleteError, setDeleteError] = useState(null); // Errores específicos de la operación de eliminación
    const [deleteSuccess, setDeleteSuccess] = useState(null); // Mensaje de éxito para la eliminación

    // Estado para el término de BÚSQUEDA de usuarios
    const [searchTerm, setSearchTerm] = useState(''); // Almacena el texto ingresado en el campo de búsqueda

    // Obtiene los datos del usuario logueado desde localStorage para validaciones (ej. no auto-eliminarse)
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const loggedInUserId = loggedInUser ? loggedInUser.id : null;

    // --- EFECTOS SECUNDARIOS ---
    // useEffect para cargar los usuarios cuando el componente se monta
    useEffect(() => {
        fetchUsers();
    }, []);

    // --- FUNCIONES ---
    // Función para obtener (fetch) todos los usuarios del backend
    const fetchUsers = async () => {
        setIsLoading(true); // Inicia estado de carga
        setError(null); // Limpia errores previos
        try {
            const token = localStorage.getItem('accessToken'); // Token JWT para autenticación
            const response = await fetch('http://localhost:3001/api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Error HTTP: ${response.status}` }));
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            setUsers(data); // Actualiza el estado con los usuarios obtenidos
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.message || 'Ocurrió un error inesperado al cargar usuarios.');
        } finally {
            setIsLoading(false); // Finaliza estado de carga
        }
    };

    // --- LÓGICA PARA MODAL DE CREACIÓN DE USUARIO ---
    const handleCreateModalOpen = () => {
        setShowCreateModal(true);
        setNewUser({ username: '', email: '', password: '', role: 'user' }); // Resetea el formulario
        setCreateError(null); // Limpia errores previos del modal
        setCreateSuccess(null); // Limpia mensajes de éxito previos
    };
    const handleCreateModalClose = () => setShowCreateModal(false);
    const handleNewUserChange = (e) => setNewUser({ ...newUser, [e.target.name]: e.target.value });

    // Manejador para el envío del formulario de creación de usuario
    const handleCreateUserSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        setCreateError(null);
        setCreateSuccess(null);
        const token = localStorage.getItem('accessToken');
        // Validación simple de campos (se podrían añadir más validaciones)
        if (!newUser.username || !newUser.email || !newUser.password) {
            setCreateError('Todos los campos (Usuario, Email, Contraseña) son requeridos.');
            return;
        }
        try {
            const response = await fetch('http://localhost:3001/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newUser),
            });
            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.message || `Error al crear usuario: ${response.status}`);
            setCreateSuccess(`Usuario '${responseData.username}' creado exitosamente!`);
            fetchUsers(); // Recarga la lista de usuarios para mostrar el nuevo
            setNewUser({ username: '', email: '', password: '', role: 'user' }); // Resetea el formulario para posible nueva creación
        } catch (err) {
            console.error('Error creating user:', err);
            setCreateError(err.message || 'Ocurrió un error inesperado al crear el usuario.');
        }
    };

    // --- LÓGICA PARA MODAL DE EDICIÓN DE USUARIO ---
    const handleEditModalOpen = (userToEdit) => {
        setEditingUser(userToEdit); // Guarda el usuario completo que se va a editar
        // Pre-llena el formulario de edición con los datos del usuario
        setEditFormData({ id: userToEdit.id, username: userToEdit.username, email: userToEdit.email, role: userToEdit.role });
        // Verifica si el usuario a editar es el mismo que está logueado
        setIsSelfEdit(loggedInUserId === userToEdit.id);
        setShowEditModal(true); // Muestra el modal
        setEditError(null); // Limpia errores previos del modal
        setEditSuccess(null); // Limpia mensajes de éxito previos
    };
    const handleEditModalClose = () => {
        setShowEditModal(false);
        setEditingUser(null); // Limpia el usuario en edición
    }
    const handleEditFormChange = (e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value });

    // Manejador para el envío del formulario de edición de usuario
    const handleEditUserSubmit = async (e) => {
        e.preventDefault();
        setEditError(null);
        setEditSuccess(null);
        const token = localStorage.getItem('accessToken');
        if (!editFormData.username || !editFormData.email) {
            setEditError('Usuario y email son requeridos.');
            return;
        }
        try {
            const { id, username, email, role } = editFormData;
            let updatePayload = { username, email }; // Payload base para la actualización

            // Si no es una auto-edición, se incluye el rol en el payload.
            // Si es auto-edición, el campo de rol está deshabilitado, por lo que se envía el rol original.
            if (!isSelfEdit) {
                updatePayload.role = role;
            } else {
                // Asegura que el rol del admin logueado no se cambie desde aquí (aunque el campo esté disabled)
                updatePayload.role = editingUser.role; 
            }

            const response = await fetch(`http://localhost:3001/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(updatePayload),
            });
            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.message || `Error al actualizar usuario: ${response.status}`);
            setEditSuccess(`Usuario '${responseData.username}' actualizado exitosamente!`);
            fetchUsers(); // Recarga la lista de usuarios
            
            // Si fue una auto-edición y se cambió el username o email, actualiza localStorage
            if (isSelfEdit && loggedInUser && (responseData.username !== loggedInUser.username || responseData.email !== loggedInUser.email)) {
                const updatedLoggedInUser = { ...loggedInUser, username: responseData.username, email: responseData.email, role: responseData.role }; // rol se mantiene
                localStorage.setItem('user', JSON.stringify(updatedLoggedInUser));
            }
        } catch (err) {
            console.error('Error updating user:', err);
            setEditError(err.message || 'Ocurrió un error inesperado al actualizar.');
        }
    };

    // --- LÓGICA PARA ELIMINAR USUARIO ---
    const handleDeleteUser = async (userIdToDelete, usernameToDelete) => {
        setDeleteError(null);
        setDeleteSuccess(null);

        // Previene que el admin se elimine a sí mismo
        if (userIdToDelete === loggedInUserId) {
            setDeleteError("No puedes eliminar tu propia cuenta.");
            setTimeout(() => setDeleteError(null), 5000); // Limpia el mensaje después de 5 seg
            return;
        }

        // Confirmación antes de eliminar
        if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario '${usernameToDelete}'? Esta acción no se puede deshacer.`)) {
            const token = localStorage.getItem('accessToken');
            try {
                const response = await fetch(`http://localhost:3001/api/users/${userIdToDelete}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: `Error al eliminar: ${response.status}` }));
                    throw new Error(errorData.message);
                }
                setDeleteSuccess(`Usuario '${usernameToDelete}' eliminado exitosamente!`);
                fetchUsers(); // Recarga la lista de usuarios
                setTimeout(() => setDeleteSuccess(null), 5000);
            } catch (err) {
                console.error('Error deleting user:', err);
                setDeleteError(err.message || 'Ocurrió un error inesperado al eliminar.');
                setTimeout(() => setDeleteError(null), 5000);
            }
        }
    };

    // --- RENDERIZADO DEL COMPONENTE ---
    // Muestra mensaje de carga si isLoading es true y no hay error general
    if (isLoading && !error) { 
        return <div className="container mt-4"><p>Cargando usuarios...</p></div>;
    }
    // Muestra mensaje de error general si existe
    if (error) return <Alert variant="danger">Error al cargar usuarios: {error.message || JSON.stringify(error)}</Alert>;

    // Filtra los usuarios basándose en el término de búsqueda (ignora mayúsculas/minúsculas)
    // Busca tanto en username como en email.
    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h2>Gestión de Usuarios</h2>
            {/* Alertas para mensajes de éxito/error de operaciones CRUD (visibles en la parte superior) */}
            {createSuccess && <Alert variant="success" onClose={() => setCreateSuccess(null)} dismissible>{createSuccess}</Alert>}
            {createError && <Alert variant="danger" onClose={() => setCreateError(null)} dismissible>{createError}</Alert>}
            {/* Las alertas de create/edit también se muestran dentro de sus modales */} 
            {deleteSuccess && <Alert variant="success" onClose={() => setDeleteSuccess(null)} dismissible>{deleteSuccess}</Alert>}
            {deleteError && <Alert variant="danger" onClose={() => setDeleteError(null)} dismissible>{deleteError}</Alert>}

            {/* Botón para abrir el modal de creación de usuario */}
            <Button variant="primary" onClick={handleCreateModalOpen} className="mb-3">
                + Crear Nuevo Usuario
            </Button>

            {/* Campo de búsqueda */}
            <Form.Group className="mb-3">
                <Form.Control 
                    type="text" 
                    placeholder="Buscar por usuario o email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el estado searchTerm al escribir
                />
            </Form.Group>

            {/* Mensaje si la búsqueda no arroja resultados pero hay usuarios cargados */}
            {users.length > 0 && filteredUsers.length === 0 && !isLoading && (
                <Alert variant="info">No se encontraron usuarios que coincidan con su búsqueda.</Alert>
            )}
            {/* Mensaje si no hay usuarios cargados en absoluto (lista inicial vacía) */}
            {users.length === 0 && !isLoading && (
                 <Alert variant="info">No hay usuarios registrados en el sistema.</Alert>
            )}

            {/* Tabla de usuarios (solo se muestra si hay usuarios filtrados) */}
            {users.length > 0 && filteredUsers.length > 0 && (
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    {/* Botón para abrir modal de edición */}
                                    <Button variant="warning" size="sm" onClick={() => handleEditModalOpen(user)} className="me-2">
                                        Editar
                                    </Button>
                                    {/* Botón para eliminar usuario (deshabilitado para auto-eliminación) */}
                                    <Button 
                                        variant="danger" 
                                        size="sm" 
                                        onClick={() => handleDeleteUser(user.id, user.username)}
                                        disabled={user.id === loggedInUserId} 
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal de Creación de Usuario */}
            <Modal show={showCreateModal} onHide={handleCreateModalClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Nuevo Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Alertas de error/éxito específicas del modal de creación */}
                    {createError && <Alert variant="danger">{createError}</Alert>}
                    {createSuccess && <Alert variant="success">{createSuccess}</Alert>}
                    {/* El formulario solo se muestra si no hay mensaje de éxito (para permitir nueva creación) */}
                    {!createSuccess && (
                        <Form onSubmit={handleCreateUserSubmit}>
                            <Form.Group className="mb-3" controlId="createFormUsername">
                                <Form.Label>Usuario</Form.Label>
                                <Form.Control type="text" placeholder="Ingrese usuario" name="username" value={newUser.username} onChange={handleNewUserChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="createFormEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Ingrese email" name="email" value={newUser.email} onChange={handleNewUserChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="createFormPassword">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control type="password" placeholder="Ingrese contraseña" name="password" value={newUser.password} onChange={handleNewUserChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="createFormRole">
                                <Form.Label>Rol</Form.Label>
                                <Form.Select name="role" value={newUser.role} onChange={handleNewUserChange}>
                                    <option value="user">Usuario</option>
                                    <option value="admin">Administrador</option>
                                </Form.Select>
                            </Form.Group>
                            <Button variant="secondary" onClick={handleCreateModalClose} className="me-2">Cerrar</Button>
                            <Button variant="primary" type="submit">Crear Usuario</Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
            
            {/* Modal de Edición de Usuario (solo se renderiza si hay un 'editingUser') */}
            {editingUser && (
                <Modal show={showEditModal} onHide={handleEditModalClose} backdrop="static" keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Usuario: {editingUser.username}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {editError && <Alert variant="danger">{editError}</Alert>}
                        {editSuccess && <Alert variant="success">{editSuccess}</Alert>}
                        {/* El formulario solo se muestra si no hay mensaje de éxito */}
                        {!editSuccess && (
                            <Form onSubmit={handleEditUserSubmit}>
                                <Form.Group className="mb-3" controlId="editFormUsername">
                                    <Form.Label>Usuario</Form.Label>
                                    <Form.Control type="text" placeholder="Ingrese usuario" name="username" value={editFormData.username} onChange={handleEditFormChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="editFormEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Ingrese email" name="email" value={editFormData.email} onChange={handleEditFormChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="editFormRole">
                                    <Form.Label>Rol</Form.Label>
                                    {/* Campo de rol deshabilitado si es auto-edición */}
                                    <Form.Select name="role" value={editFormData.role} onChange={handleEditFormChange} disabled={isSelfEdit}>
                                        <option value="user">Usuario</option>
                                        <option value="admin">Administrador</option>
                                    </Form.Select>
                                    {isSelfEdit && <Form.Text className="text-muted">No puedes cambiar tu propio rol.</Form.Text>}
                                </Form.Group>
                                <Button variant="secondary" onClick={handleEditModalClose} className="me-2">Cerrar</Button>
                                <Button variant="primary" type="submit">Guardar Cambios</Button>
                            </Form>
                        )}
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
}

export default AdminPanel;
