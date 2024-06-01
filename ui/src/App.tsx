import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import './App.css';
import FormComponent from './components/FormComponent';

const App: React.FC<{ theme: string }> = ({ theme }) => {
  return (
    <div>
      <Navbar bg={theme} variant={theme}>
        <Container>
          <Navbar.Brand href="#home">React Bootstrap</Navbar.Brand>
          <Navigation />
        </Container>
      </Navbar>
      <Container fluid className="app-container">
        <div className="d-flex">
          <Sidebar />
          <div className="content-container">
            <FormComponent />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default App;
