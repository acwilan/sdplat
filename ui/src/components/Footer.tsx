import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <Container>
        <Row>
          <Col className="text-center">
            <p>
              Build from branch: {process.env.BRANCH} <br />
              Commit ID: {process.env.COMMIT_ID}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
