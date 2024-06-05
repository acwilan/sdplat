// src/components/FormComponent.tsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

export type ModelInfo = {
  id: string;
  name: string;
  description?: string;
  beamId?: string;
  baseModel?: string;
};

export type FormData = {
  prompt: string;
  model: string;
  height: string;
  width: string;
  negativePrompt: string;
}

const emptyForm: FormData = {
  prompt: '',
  model: '',
  height: '',
  width: '',
  negativePrompt: ''
}
const storedFormDataStr: string = localStorage.getItem("formData") || JSON.stringify(emptyForm);
const initialFormData: FormData = JSON.parse(storedFormDataStr);

interface FormComponentProps {
  submitHandler?: (formData: FormData) => Promise<void>;
  clearHandler?: () => void;
  requestCompleted?: () => void;
  sortedModels: ModelInfo[];
}

export const FormComponent: React.FC<FormComponentProps> = ({ submitHandler, sortedModels, clearHandler, requestCompleted }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormBlocked, setIsFormBlocked] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: FormData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem('formData', JSON.stringify(formData));
    if (submitHandler) {
      setIsFormBlocked(true);
      submitHandler(formData).finally(() => {
        setIsFormBlocked(false);
      });
    }
  };

  const handleClear = () => {
    setFormData(emptyForm);
    // Clear persisted formData from local storage
    localStorage.removeItem('formData');
    if (clearHandler) {
      clearHandler();
    }
  };

  useEffect(() => {
    const isValid = formData !== undefined && (
      (formData.prompt !== undefined && formData.prompt.trim() !== '') &&
      (formData.model !== undefined && formData.model.trim() !== '')
    );
    setIsFormValid(isValid);
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  return (
    <>
      <h2>Text to image</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} controlId="formPrompt">
          <Form.Label column sm={2}>Prompt:</Form.Label>
          <Col sm={10}>
            <Form.Control as="textarea" rows={3} name="prompt" value={formData.prompt} onChange={handleChange} disabled={isFormBlocked} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="formModel">
          <Form.Label column sm={2}>Model:</Form.Label>
          <Col sm={10}>
            <Form.Control as="select" name="model" value={formData.model} onChange={handleChange} disabled={isFormBlocked}>
              <option value="">Choose a model</option>
              {sortedModels.map((model: any) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </Form.Control>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="formHeight">
          <Form.Label column sm={2}>Height:</Form.Label>
          <Col sm={10}>
            <Form.Control type="number" name="height" value={formData.height} onChange={handleChange} disabled={isFormBlocked} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="formWidth">
          <Form.Label column sm={2}>Width:</Form.Label>
          <Col sm={10}>
            <Form.Control type="number" name="width" value={formData.width} onChange={handleChange} disabled={isFormBlocked} />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="formNegativePrompt">
          <Form.Label column sm={2}>Negative Prompt:</Form.Label>
          <Col sm={10}>
            <Form.Control as="textarea" rows={3} name="negativePrompt" value={formData.negativePrompt} onChange={handleChange} disabled={isFormBlocked} />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Col sm={{ span: 10, offset: 2 }}>
            <Button type="submit" variant='primary' disabled={!isFormValid || isFormBlocked}>Submit</Button>
            <Button type="button" variant='link' onClick={handleClear} disabled={isFormBlocked}>Clear</Button>
          </Col>
        </Form.Group>
      </Form>
    </>
  );
};
