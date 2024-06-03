import React, { useState, useEffect } from 'react';
import { Button, Collapse, Nav } from 'react-bootstrap';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(() => {
    const storedValue = localStorage.getItem('sidebarCollapsed');
    return storedValue ? JSON.parse(storedValue) : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(open));
  }, [open]);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <div className={`sidebar ${open ? 'open' : 'collapsed'}`}>
      <Button
        onClick={toggleSidebar}
        aria-label='Toggle Sidebar'
        aria-controls="example-collapse"
        aria-expanded={open}
        className="toggle-btn"
      >
        <i className={`bi ${open ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
      </Button>
      <Collapse in={open}>
        <div id="example-collapse">
          <Nav className="flex-column">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#services">Services</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>
        </div>
      </Collapse>
    </div>
  );
};

export default Sidebar;
