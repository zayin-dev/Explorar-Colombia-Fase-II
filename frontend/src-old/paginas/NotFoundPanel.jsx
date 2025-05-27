import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Alert } from 'react-bootstrap';

function NotFoundPanel() {
  return (
    <Container className="mt-5 text-center">
      <Alert variant="warning">
        <Alert.Heading>404 - Page Not Found</Alert.Heading>
        <p>
          The page you are looking for under the panel section does not exist.
        </p>
        <hr />
        <p className="mb-0">
          <Link to="/panel" className="alert-link">Return to Panel Home</Link>
        </p>
      </Alert>
    </Container>
  );
}

export default NotFoundPanel;
