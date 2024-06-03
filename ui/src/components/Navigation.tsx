import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import './Navigation.css';

const Navigation: React.FC = () => {
  return (
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={NavLink} to="/">Home</Nav.Link>
          <Nav.Link as={NavLink} to="/txt2img">Text to image</Nav.Link>
          <Nav.Link as={NavLink} to="/img2img">Image to image</Nav.Link>
          <Nav.Link as={NavLink} to="/txt2vid">Text to video</Nav.Link>
        </Nav>
      </Navbar.Collapse>
  );
};

export default Navigation;
