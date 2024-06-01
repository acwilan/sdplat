import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

test('renders welcome message', () => {
  render(<App />);
  const linkElement = screen.getByText(/welcome to react bootstrap/i);
  expect(linkElement).toBeInTheDocument();
});
