import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

test('renders welcome message', () => {
  render(<App theme='light' />);
  const linkElement = screen.getByText(/This is the main content area/i);
  expect(linkElement).toBeInTheDocument();
});
