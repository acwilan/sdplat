import React, { useEffect, useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import './App.css';
import Home from './components/Home';
import Txt2Img from './components/Txt2Img';

const Img2Img = () => <h2>Image to Image (Img2Img)</h2>;
const Txt2Vid = () => <h2>Text to Video (Txt2Vid)</h2>;

// A custom hook to extract the first path segment
const useFirstPathSegment = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  return pathSegments[0] || 'beam';
};

const App: React.FC<{ theme: string }> = ({ theme }) => {
  const firstPathSegment = useFirstPathSegment();

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
          <Sidebar pathSegment={firstPathSegment} />
          <div className="content-container">
            <Routes>
              <Route path='/' element={<Home pathSegment='' />} />
              <Route path={`/${firstPathSegment}`} element={<Home pathSegment={firstPathSegment} />} />
              <Route path={`/${firstPathSegment}/img2img`} element={<Img2Img />} />
              <Route path={`/${firstPathSegment}/txt2img`} element={<Txt2Img pathSegment={firstPathSegment} />} />
              <Route path={`/${firstPathSegment}/txt2vid`} element={<Txt2Vid />} />
            </Routes>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default App;
