import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

test('renders welcome message', () => {
  render(<App theme='light' />);
  const linkElement = screen.getByText(/txt2img: Input parameters/i);
  expect(linkElement).toBeInTheDocument();
});
