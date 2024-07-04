import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, Navbar, NavbarText } from 'react-bootstrap';
import './Navigation.css';

const Navigation: React.FC = () => {
  return (
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={NavLink} to="/">Home</Nav.Link>
          <Nav.Link as={NavLink} to="/beam">Beam</Nav.Link>
          <Nav.Link as={NavLink} to="/modelslab">Modelslab</Nav.Link>
          <Nav.Link as={NavbarText}>Stability AI</Nav.Link>
        </Nav>
      </Navbar.Collapse>
  );
};

export default Navigation;
