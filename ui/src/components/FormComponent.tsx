// src/components/FormComponent.tsx
import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const FormComponent: React.FC = () => {
  const [formData, setFormData] = useState({
    prompt: '',
    model: '',
    height: 0,
    width: 0,
    negativePrompt: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Persist formData to local storage
    localStorage.setItem('formData', JSON.stringify(formData));
  };

  const handleClear = () => {
    setFormData({
      prompt: '',
      model: '',
      height: 0,
      width: 0,
      negativePrompt: '',
    });
    // Clear persisted formData from local storage
    localStorage.removeItem('formData');
  };

  return (
    <>
      <h2>Text to image</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} controlId="formPrompt">
          <Form.Label column sm={2}>Prompt:</Form.Label>
          <Col sm={10}>
            <Form.Control as="textarea" rows={3} name="prompt" value={formData.prompt} onChange={handleChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="formModel">
          <Form.Label column sm={2}>Model:</Form.Label>
          <Col sm={10}>
            <Form.Control as="select" name="model" value={formData.model} onChange={handleChange}>
              <option value="model1">Model 1</option>
              <option value="model2">Model 2</option>
              <option value="model3">Model 3</option>
            </Form.Control>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="formHeight">
          <Form.Label column sm={2}>Height:</Form.Label>
          <Col sm={10}>
            <Form.Control type="number" name="height" value={formData.height} onChange={handleChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="formWidth">
          <Form.Label column sm={2}>Width:</Form.Label>
          <Col sm={10}>
            <Form.Control type="number" name="width" value={formData.width} onChange={handleChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="formNegativePrompt">
          <Form.Label column sm={2}>Negative Prompt:</Form.Label>
          <Col sm={10}>
            <Form.Control as="textarea" rows={3} name="negativePrompt" value={formData.negativePrompt} onChange={handleChange} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Col sm={{ span: 10, offset: 2 }}>
            <Button type="submit" variant='primary'>Submit</Button>
            <Button type="button" variant='link' onClick={handleClear}>Clear</Button>
          </Col>
        </Form.Group>
      </Form>
    </>
  );
};

export default FormComponent;
