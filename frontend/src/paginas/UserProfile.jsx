// --- Importaciones --- //
// React y Hooks necesarios
import React, { useState, useEffect } from 'react';
// Componentes de React Bootstrap para la UI
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
// Hook para navegación (si es necesario redirigir tras una acción)
import { useNavigate } from 'react-router-dom';

// --- Constantes --- //
// URLs de los endpoints del API para el perfil de usuario
const API_URL_USERNAME = '/api/auth/profile/username';
const API_URL_EMAIL = '/api/auth/profile/email';
const API_URL_PASSWORD = '/api/auth/profile/password';

// --- Componente UserProfile --- //
/**
 * @function UserProfile
 * @description Página para que los usuarios gestionen los detalles de su perfil,
 * incluyendo el cambio de nombre de usuario, email y contraseña.
 */
const UserProfile = () => {
  // --- NUEVO: Estados para imagen de perfil --- //
  const [profileImage, setProfileImage] = useState(null); // URL de la imagen actual
  const [selectedImage, setSelectedImage] = useState(null); // Archivo seleccionado
  const [imageLoading, setImageLoading] = useState(false);
  const [imageMessage, setImageMessage] = useState('');
  const [imageError, setImageError] = useState('');
  // Hook para navegación programática
  const navigate = useNavigate();

  // --- Estados del Componente --- //
  // Datos del usuario actual (se podrían cargar desde localStorage o una API)
  const [currentUser, setCurrentUser] = useState({ username: '', email: '' });

  // Estados para el formulario de cambio de nombre de usuario
  const [newUsername, setNewUsername] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState('');
  const [usernameError, setUsernameError] = useState('');

  // Estados para el formulario de cambio de email
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  // Estados para el formulario de cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState(''); // Para confirmar la nueva contraseña
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // --- Efectos Secundarios (useEffect) --- //
  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    // Obtener el token de autenticación de localStorage
    const token = localStorage.getItem('accessToken');
    const userData = JSON.parse(localStorage.getItem('user')); // Asumiendo que 'user' tiene { username, email }

    if (!token) {
      // Si no hay token, redirigir al login o mostrar mensaje
      // Idealmente, esta página debería estar protegida por una ruta privada que ya haga esto.
      navigate('/login');
      return;
    }
    if (userData) {
      setCurrentUser({ username: userData.username, email: userData.email });
      setNewUsername(userData.username); // Pre-rellenar el campo de username
      setNewEmail(userData.email);       // Pre-rellenar el campo de email
      // --- NUEVO: Cargar imagen de perfil si existe ---
      if (userData.profile_image) {
        setProfileImage(userData.profile_image);
      }
    }
  }, [navigate]);

  // --- Manejadores de Eventos (Formularios) --- //

  /**
   * @function handleImageChange
   * @description Maneja la selección de archivo de imagen.
   */
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setImageMessage('');
    setImageError('');
  };

  /**
   * @function handleUploadProfileImage
   * @description Sube la imagen de perfil al backend.
   */
  const handleUploadProfileImage = async (e) => {
    e.preventDefault();
    setImageLoading(true);
    setImageMessage('');
    setImageError('');
    const token = localStorage.getItem('accessToken');
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!selectedImage) {
      setImageError('Por favor selecciona una imagen.');
      setImageLoading(false);
      return;
    }
    if (!userData || !userData.id) {
      setImageError('No se pudo obtener el ID del usuario.');
      setImageLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('profile_image', selectedImage);
      const response = await fetch(`/api/users/${userData.id}/profile-image`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        setImageError(data.message || 'Error al subir la imagen.');
      } else {
        setImageMessage(data.message || 'Imagen de perfil actualizada correctamente.');
        setProfileImage(data.profile_image);
        // Actualizar en localStorage
        userData.profile_image = data.profile_image;
        localStorage.setItem('user', JSON.stringify(userData));
        setSelectedImage(null);
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      setImageError('Error de red o servidor al subir la imagen.');
    } finally {
      setImageLoading(false);
    }
  };

  /**
   * @function handleUpdateUsername
   * @description Maneja el envío del formulario para actualizar el nombre de usuario.
   */
  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    setUsernameLoading(true);
    setUsernameMessage('');
    setUsernameError('');

    if (!newUsername.trim()) {
      setUsernameError('El nombre de usuario no puede estar vacío.');
      setUsernameLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(API_URL_USERNAME, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newUsername }),
      });

      const data = await response.json();

      if (!response.ok) {
        setUsernameError(data.message || 'Error al actualizar el nombre de usuario.');
      } else {
        setUsernameMessage(data.message || 'Nombre de usuario actualizado con éxito.');
        // Actualizar el nombre de usuario en localStorage si es necesario
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
          userData.username = newUsername;
          localStorage.setItem('user', JSON.stringify(userData));
          setCurrentUser(prev => ({ ...prev, username: newUsername }));
        }
      }
    } catch (error) {
      console.error('Error en handleUpdateUsername:', error);
      setUsernameError('Error de red o servidor al actualizar el nombre de usuario.');
    } finally {
      setUsernameLoading(false);
    }
  };

  /**
   * @function handleUpdateEmail
   * @description Maneja el envío del formulario para actualizar el email.
   */
  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailMessage('');
    setEmailError('');

    if (!newEmail.trim()) {
      setEmailError('El email no puede estar vacío.');
      setEmailLoading(false);
      return;
    }
    // Validación básica de formato de email
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(newEmail)) {
        setEmailError('El formato del correo electrónico no es válido.');
        setEmailLoading(false);
        return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(API_URL_EMAIL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        setEmailError(data.message || 'Error al actualizar el email.');
      } else {
        setEmailMessage(data.message || 'Email actualizado con éxito.');
        // Actualizar el email en localStorage si es necesario
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
          userData.email = newEmail;
          localStorage.setItem('user', JSON.stringify(userData));
          setCurrentUser(prev => ({ ...prev, email: newEmail }));
        }
        // Considerar: si el backend requiere verificación del nuevo email,
        // mostrar un mensaje indicando que se ha enviado un correo de verificación.
      }
    } catch (error) {
      console.error('Error en handleUpdateEmail:', error);
      setEmailError('Error de red o servidor al actualizar el email.');
    } finally {
      setEmailLoading(false);
    }
  };

  /**
   * @function handleUpdatePassword
   * @description Maneja el envío del formulario para actualizar la contraseña.
   */
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage('');
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('Todos los campos de contraseña son obligatorios.');
      setPasswordLoading(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('Las nuevas contraseñas no coinciden.');
      setPasswordLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
      setPasswordLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(API_URL_PASSWORD, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.message || 'Error al actualizar la contraseña.');
      } else {
        setPasswordMessage(data.message || 'Contraseña actualizada con éxito.');
        // Limpiar campos de contraseña tras éxito
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (error) {
      console.error('Error en handleUpdatePassword:', error);
      setPasswordError('Error de red o servidor al actualizar la contraseña.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // --- Renderizado del Componente --- //
  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={8} lg={6}>
          <h2 className="text-center mb-4">Gestionar Perfil</h2>

          {/* --- NUEVO: Sección Imagen de Perfil --- */}
          <Card className="mb-4 text-center">
            <Card.Header as="h5">Imagen de Perfil</Card.Header>
            <Card.Body>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', marginBottom: 16, border: '2px solid #ddd', background: '#f8f9fa' }}>
                  {profileImage ? (
                    <img
                      src={profileImage.startsWith('http') ? profileImage : `${profileImage}`}
                      alt="Imagen de perfil"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ lineHeight: '120px', color: '#bbb' }}>Sin imagen</span>
                  )}
                </div>
                <Form onSubmit={handleUploadProfileImage} style={{ width: '100%', maxWidth: 350 }}>
                  {imageMessage && <Alert variant="success">{imageMessage}</Alert>}
                  {imageError && <Alert variant="danger">{imageError}</Alert>}
                  <Form.Group controlId="formProfileImage" className="mb-3">
                    <Form.Label>Cambiar imagen de perfil</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                  </Form.Group>
                  <Button variant="primary" type="submit" disabled={imageLoading} style={{ minWidth: 160 }}>
                    {imageLoading ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Subiendo...</> : 'Subir Imagen'}
                  </Button>
                </Form>
              </div>
            </Card.Body>
          </Card>

          {/* --- Sección: Actualizar Nombre de Usuario --- */}
          <Card className="mb-4">
            <Card.Header as="h5">Actualizar Nombre de Usuario</Card.Header>
            <Card.Body>
              <Form onSubmit={handleUpdateUsername}>
                {usernameMessage && <Alert variant="success">{usernameMessage}</Alert>}
                {usernameError && <Alert variant="danger">{usernameError}</Alert>}
                <Form.Group className="mb-3" controlId="formNewUsername">
                  <Form.Label>Nuevo Nombre de Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese su nuevo nombre de usuario"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    Su nombre de usuario actual es: <strong>{currentUser.username}</strong>
                  </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit" disabled={usernameLoading}>
                  {usernameLoading ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Actualizando...</> : 'Actualizar Nombre de Usuario'}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* --- Sección: Actualizar Email --- */}
          <Card className="mb-4">
            <Card.Header as="h5">Actualizar Email</Card.Header>
            <Card.Body>
              <Form onSubmit={handleUpdateEmail}>
                {emailMessage && <Alert variant="success">{emailMessage}</Alert>}
                {emailError && <Alert variant="danger">{emailError}</Alert>}
                <Form.Group className="mb-3" controlId="formNewEmail">
                  <Form.Label>Nuevo Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingrese su nuevo email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    Su email actual es: <strong>{currentUser.email}</strong>
                  </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit" disabled={emailLoading}>
                  {emailLoading ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Actualizando...</> : 'Actualizar Email'}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* --- Sección: Actualizar Contraseña --- */}
          <Card>
            <Card.Header as="h5">Actualizar Contraseña</Card.Header>
            <Card.Body>
              <Form onSubmit={handleUpdatePassword}>
                {passwordMessage && <Alert variant="success">{passwordMessage}</Alert>}
                {passwordError && <Alert variant="danger">{passwordError}</Alert>}
                <Form.Group className="mb-3" controlId="formCurrentPassword">
                  <Form.Label>Contraseña Actual</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Ingrese su contraseña actual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formNewPassword">
                  <Form.Label>Nueva Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Ingrese su nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formConfirmNewPassword">
                  <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirme su nueva contraseña"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={passwordLoading}>
                  {passwordLoading ? <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Actualizando...</> : 'Actualizar Contraseña'}
                </Button>
              </Form>
            </Card.Body>
          </Card>

        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
