// src/components/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import './Home.css'; // Add custom CSS for clickable cards

const Home = () => {
  const features = [
    { name: 'Text to image (Txt2Img)', path: '/txt2img' },
    { name: 'Image to image (Img2Img)', path: '/img2img' },
    { name: 'Text to video (Txt2Vid)', path: '/txt2vid' },
  ];

  return (
    <>
        <h2>Welcome</h2>
        <Row className="mt-4">
        {features.map((feature, index) => (
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
