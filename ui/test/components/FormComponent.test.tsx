// src/components/FormComponent.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FormComponent from '../../src/components/FormComponent';

describe('FormComponent', () => {
  test('should update form data when inputs change', () => {
    const { getByLabelText } = render(<FormComponent />);

    fireEvent.change(getByLabelText('Prompt:'), { target: { value: 'Test Prompt' } });
    fireEvent.change(getByLabelText('Model:'), { target: { value: '2' } });
    fireEvent.change(getByLabelText('Height:'), { target: { value: '100' } });
    fireEvent.change(getByLabelText('Width:'), { target: { value: '200' } });
    fireEvent.change(getByLabelText('Negative Prompt:'), { target: { value: 'Test Negative Prompt' } });

    expect(getByLabelText('Prompt:')).toHaveValue('Test Prompt');
    expect(getByLabelText('Model:')).toHaveValue('2');
    expect(getByLabelText('Height:')).toHaveValue(100);
    expect(getByLabelText('Width:')).toHaveValue(200);
    expect(getByLabelText('Negative Prompt:')).toHaveValue('Test Negative Prompt');
  });

  test('should clear form data when Clear button is clicked', () => {
    const { getByText, getByLabelText } = render(<FormComponent />);

    fireEvent.change(getByLabelText('Prompt:'), { target: { value: 'Test Prompt' } });
    fireEvent.change(getByLabelText('Model:'), { target: { value: '2' } });
    fireEvent.change(getByLabelText('Height:'), { target: { value: '100' } });
    fireEvent.change(getByLabelText('Width:'), { target: { value: '200' } });
    fireEvent.change(getByLabelText('Negative Prompt:'), { target: { value: 'Test Negative Prompt' } });

    fireEvent.click(getByText('Clear'));

    expect(getByLabelText('Prompt:')).toHaveValue('');
    expect(getByLabelText('Model:')).toHaveValue('');
    expect(getByLabelText('Height:')).toHaveValue(null);
    expect(getByLabelText('Width:')).toHaveValue(null);
    expect(getByLabelText('Negative Prompt:')).toHaveValue('');
  });

  test('should persist form data to local storage when Submit button is clicked', () => {
    const { getByText, getByLabelText } = render(<FormComponent submitHandler={() => {}} />);

    fireEvent.change(getByLabelText('Prompt:'), { target: { value: 'Test Prompt' } });
    fireEvent.change(getByLabelText('Model:'), { target: { value: '2' } });
    fireEvent.change(getByLabelText('Height:'), { target: { value: '100' } });
    fireEvent.change(getByLabelText('Width:'), { target: { value: '200' } });
    fireEvent.change(getByLabelText('Negative Prompt:'), { target: { value: 'Test Negative Prompt' } });

    fireEvent.click(getByText('Submit'));

    const formData = JSON.parse(localStorage.getItem('formData') || '{}');

    expect(formData).toEqual({
      prompt: 'Test Prompt',
      model: '2',
      height: '100',
      width: '200',
      negativePrompt: 'Test Negative Prompt',
    });
  });
});
