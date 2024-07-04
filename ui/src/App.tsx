import React from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import './App.css';
import Home from './components/Home';
import TextInputView from './components/TextInputView';
import { config } from '../../conf/sdConfig';
import { beamApiCall, modelsLabApiCall } from './api';

const beamModels = config.beam.models;

const Img2Img = () => <h2>Image to Image (Img2Img)</h2>;

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

              <Route path='/beam' element={<Home pathSegment='beam' />} />
              <Route path='/beam/img2img' element={<Img2Img />} />
              <Route path='/beam/txt2img' element={<TextInputView title='Text to Image (beam)' modelTarget='txt2img' apiCall={beamApiCall} models={beamModels} />} />
              <Route path='/beam/txt2vid' element={<TextInputView title='Text to Video (beam)' modelTarget='txt2vid' apiCall={beamApiCall} models={beamModels} />} />

              <Route path='/modelslab' element={<Home pathSegment='modelslab' />} />
              <Route path='/modelslab/txt2img' element={<TextInputView title='Text to Image (modelslab)' modelTarget='modelslab' apiCall={modelsLabApiCall} models={beamModels} />} />
            </Routes>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default App;
