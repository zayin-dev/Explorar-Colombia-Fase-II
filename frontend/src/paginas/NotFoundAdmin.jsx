import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Alert } from 'react-bootstrap';

function NotFoundAdmin() {
  return (
    <Container className="mt-5 text-center">
      <Alert variant="danger">
        <Alert.Heading>404 - Admin Page Not Found</Alert.Heading>
        <p>
          The specific admin page you are looking for does not exist.
        </p>
        <hr />
        <p className="mb-0">
          <Link to="/admin/user-management" className="alert-link">Return to User Management</Link>
        </p>
      </Alert>
    </Container>
  );
}

export default NotFoundAdmin;
