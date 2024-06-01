import React from 'react';
import { Nav } from 'react-bootstrap';

const Navigation: React.FC = () => {
  return (
        <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
        </Nav>
  );
};

export default Navigation;
