import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function BarraNavegacion({ isAuthenticated, onLogout }) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">🌐 Explorar Colombia</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            {isAuthenticated && <Nav.Link as={Link} to="/panel">Panel</Nav.Link>}
            {!isAuthenticated ? (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            ) : (
              <Nav.Link onClick={onLogout}>Logout</Nav.Link>
            )}
            <NavDropdown title="Más" id="basic-nav-dropdown">
              {isAuthenticated && <NavDropdown.Item as={Link} to="/profile">Mi Perfil</NavDropdown.Item>}
              <NavDropdown.Item href="#accion1">Acción 1</NavDropdown.Item>
              <NavDropdown.Item href="#accion2">Acción 2</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#separado">Separado</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BarraNavegacion;