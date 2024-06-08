import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Home from '../src/components/Home';
import App from '../src/App';
import { FormComponent } from '../src/components/FormComponent';
import { mockModels } from './mocks/models';

test('renders welcome message', () => {
  render(
    <MemoryRouter>
      <App theme="light" />
    </MemoryRouter>
  );
  const linkElement = screen.getByText(/Welcome/i);
  expect(linkElement).toBeInTheDocument();
});

test('navigates to Txt2Img page when the card is clicked', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/txt2img" element={<FormComponent models={mockModels} />} />
      </Routes>
    </MemoryRouter>
  );

  // Click on the "Text to image (Txt2Img)" card
  userEvent.click(screen.getByText(/Text to image \(Txt2Img\)/i));

  // Check if the FormComponent is rendered
  expect(screen.getByText(/Text to image/i)).toBeInTheDocument();
});

test('renders Home component at the root path', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </MemoryRouter>
  );

  // Check if the Home component is rendered
  expect(screen.getByText(/text to image \(txt2img\)/i)).toBeInTheDocument();
  expect(screen.getByText(/image to image \(img2img\)/i)).toBeInTheDocument();
  expect(screen.getByText(/text to video \(txt2vid\)/i)).toBeInTheDocument();
});