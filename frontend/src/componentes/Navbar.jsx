import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const API_URL_USERNAME = '/api/auth/profile/username';

function BarraNavegacion({ isAuthenticated, onLogout }) {
  // Obtener la imagen de perfil del usuario desde localStorage
  let profileImage = null;
  let currentUser = null;
  if (isAuthenticated) {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.profile_image) {
        profileImage = user.profile_image.startsWith('http')
          ? user.profile_image
          : `http://localhost:3001${user.profile_image}`;
      }
      currentUser = user;
    } catch (e) { /* ignore */ }
  }




  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">🌐 Explorar Colombia</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto" style={{ alignItems: 'center' }}>
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            {isAuthenticated && <Nav.Link as={Link} to="/panel">Panel</Nav.Link>}
            {/* {!isAuthenticated ? (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            ) : (
              <Nav.Link onClick={onLogout}>Logout</Nav.Link>
            )} */}
            {/* <NavDropdown title="Más" id="basic-nav-dropdown">
              {isAuthenticated && <NavDropdown.Item as={Link} to="/profile">Mi Perfil</NavDropdown.Item>}
              <NavDropdown.Item href="#accion1">Acción 1</NavDropdown.Item>
              <NavDropdown.Item href="#accion2">Acción 2</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#separado">Separado</NavDropdown.Item>
            </NavDropdown> */}
            {/* {isAuthenticated && (
              <div style={{ marginLeft: 16, display: 'flex', alignItems: 'center' }}>
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="avatar"
                    style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', background: '#eee' }}
                  />
                ) : (
                  <span
                    style={{ width: 38, height: 38, borderRadius: '50%', background: '#bbb', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, border: '2px solid #fff' }}
                  >
                    <i className="bi bi-person-circle" />
                  </span>
                )}
              </div>
            )} */}

            {isAuthenticated ? (
              <NavDropdown
                title={
                  profileImage ? (
                    <img src={profileImage} alt="avatar" style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #fff', background: '#eee', objectFit: 'cover' }} />
                  ) : (
                    <i className="bi bi-person-circle" style={{ fontSize: 38 }} />
                  )
                }
                id="profile-dropdown"
                align="end"
              >
                {/* <NavDropdown.Item>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={profileImage} alt="avatar" style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #fff', background: '#eee', objectFit: 'cover' }} />
                    <span>{currentUser.username}</span>
                  </div>
                </NavDropdown.Item> */}
                <NavDropdown.Item>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={profileImage}
                      alt="avatar"
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        border: '2px solid #fff',
                        background: '#eee',
                        objectFit: 'cover'
                      }}
                    />
                    <span style={{ marginLeft: 8 }}>
                      {currentUser && currentUser.username ? currentUser.username : "Usuario"}
                    </span>
                  </div>
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/profile">Mi Perfil</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={onLogout}>Cerrar sesión</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login">Iniciar sesión</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


export default BarraNavegacion;