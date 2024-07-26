import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Footer.css';

const Footer: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <footer className={`footer mt-auto py-3 bg-light ${isCollapsed ? 'collapsed' : ''}`}>
      <Container>
        <Row>
          <Col className="text-center">
            <Button variant="link" onClick={toggleCollapse} aria-label="Toggle footer" aria-expanded={!isCollapsed}>
              <i className={`bi ${isCollapsed ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
            </Button>
            {!isCollapsed && (
              <div>
                <p>
                  Version: {process.env.VERSION} <br />
                  Build Date: {process.env.BUILD_DATE} <br />
                  Build from branch: {process.env.BRANCH} <br />
                  Commit ID: {process.env.COMMIT_ID}
                </p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
