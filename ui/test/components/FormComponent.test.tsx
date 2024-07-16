// src/components/FormComponent.test.tsx
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { FormComponent, FormData } from '../../src/components/FormComponent';
import { mockModels } from '../mocks/models';
import useLastSegment from '../../src/hooks/use-last-segment';

jest.mock('../../src/hooks/use-last-segment');

// Cast useLastSegment to a jest.Mock
const mockedUseLastSegment = useLastSegment as jest.Mock;

// Set the return value of the mock
mockedUseLastSegment.mockReturnValue('txt2img');


const promiseHandler: (formData: FormData) => Promise<any> = (formData: FormData) => {
  return new Promise<any>((resolve, reject) => {
    resolve(true);
  });
};

describe('FormComponent', () => {
  test('should update form data when inputs change', () => {
    const { getByLabelText } = render(<FormComponent title='' models={mockModels} />);

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
    const { getByText, getByLabelText } = render(<FormComponent title='' models={mockModels} clearHandler={() => {}} />);

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

  test('should persist form data to local storage when Submit button is clicked', async () => {
    const { getByText, getByLabelText } = render(<FormComponent title='' models={mockModels} submitHandler={promiseHandler} clearHandler={() => console.log('clear')} />);

    fireEvent.change(getByLabelText('Prompt:'), { target: { value: 'Test Prompt' } });
    fireEvent.change(getByLabelText('Model:'), { target: { value: '2' } });
    fireEvent.change(getByLabelText('Height:'), { target: { value: '100' } });
    fireEvent.change(getByLabelText('Width:'), { target: { value: '200' } });
    fireEvent.change(getByLabelText('Negative Prompt:'), { target: { value: 'Test Negative Prompt' } });

    await act(async () => fireEvent.click(getByText('Submit')));

    const formData = JSON.parse(localStorage.getItem('formData') || '{}');

    expect(formData).toEqual({
      prompt: 'Test Prompt',
      model: '2',
      height: '100',
      width: '200',
      negativePrompt: 'Test Negative Prompt',
      transcript: "",
    });
  });
});
