// src/components/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import './Home.css'; // Add custom CSS for clickable cards
import { PathComponentProps } from '../types';
import { camelCaseToSentence } from '../stringUtils';

const Home: React.FC<PathComponentProps> = ({ pathSegment }) => {
  const features = pathSegment ? [
    { name: 'Text to image', path: `/${pathSegment}/txt2img` },
    { name: 'Image to image', path: '' },
    { name: 'Text to video', path: `/${pathSegment}/txt2vid` },
    { name: 'Text to audio', path: `/${pathSegment}/txt2aud` },
    { name: 'Text to speech', path: `/${pathSegment}/txt2spch` },
  ] : [
    { name: 'Beam', path: '/beam' },
    { name: 'ModelsLab', path: '/modelslab' }
  ];

  const title: string = camelCaseToSentence(pathSegment || 'welcomeToSdPlat');

  return (
    <>
        <h2>{title}</h2>
        <Row className="mt-4">
        {features.filter(feature => feature.path !== '').map((feature, index) => (
            <Col key={index} sm={12} md={4} className="mb-4">
            <Link to={feature.path} className="card-link">
                <Card>
                <Card.Body>
                    <Card.Title>{feature.name}</Card.Title>
                </Card.Body>
                </Card>
            </Link>
            </Col>
        ))}
        </Row>
    </>
  );
};

export default Home;
