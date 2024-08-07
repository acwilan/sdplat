import React, { useState, useEffect } from 'react';
import { Button, Collapse, Nav, NavbarText } from 'react-bootstrap';
import './Sidebar.css';
import { PathComponentProps } from '../types';

const Sidebar: React.FC<PathComponentProps> = ({ pathSegment }) => {
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

  return (pathSegment && (
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
            <Nav.Link href={`/${pathSegment}/txt2Img`}>Text to image</Nav.Link>
            <Nav.Link as={NavbarText}>Image to image</Nav.Link>
            {pathSegment === 'beam' && (
              <>
            <Nav.Link href={`/${pathSegment}/txt2vid`}>Text to video</Nav.Link>
            <Nav.Link href={`/${pathSegment}/txt2aud`}>Text to audio</Nav.Link>
            <Nav.Link href={`/${pathSegment}/txt2spch`}>Text to speech</Nav.Link>
              </>
            )}
          </Nav>
        </div>
      </Collapse>
    </div>
  )) || (<div></div>);
};

export default Sidebar;
