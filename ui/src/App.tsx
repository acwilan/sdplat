import React from 'react';
import { Button, Navbar, Nav, Container } from 'react-bootstrap';

const App: React.FC = () => {
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">React Bootstrap</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container className="mt-3">
        <h1>Welcome to React Bootstrap</h1>
        <Button variant="primary">Hello, React Bootstrap!</Button>
      </Container>
    </div>
  );
};

export default App;
