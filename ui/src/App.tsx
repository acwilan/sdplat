import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import './App.css';
import Home from './components/Home';
import Txt2Img from './components/Txt2Img';

const Img2Img = () => <h2>Image to Image (Img2Img)</h2>;
const Txt2Vid = () => <h2>Text to Video (Txt2Vid)</h2>;

const App: React.FC<{ theme: string }> = ({ theme }) => {
  return (
    <div>
      <Navbar bg={theme} variant={theme} expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">SD Plat</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navigation />
        </Container>
      </Navbar>
      <Container fluid className="app-container">
        <div className="d-flex">
          <Sidebar />
          <div className="content-container">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/txt2img' element={<Txt2Img />} />
              <Route path="/img2img" element={<Img2Img />} />
              <Route path="/txt2vid" element={<Txt2Vid />} />
            </Routes>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default App;
