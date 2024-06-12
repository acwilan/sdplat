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
  const linkElement = screen.getByText(/welcome to sd plat/i);
  expect(linkElement).toBeInTheDocument();
});

test('navigates to Txt2Img page when the card is clicked', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<Home pathSegment='' />} />
        <Route path="/txt2img" element={<FormComponent models={mockModels} />} />
      </Routes>
    </MemoryRouter>
  );

  // Click on the "Beam" card
  userEvent.click(screen.getByText(/Beam/i));

  // Check if the FormComponent is rendered
  expect(screen.getByText(/Beam/i)).toBeInTheDocument();
});

test('renders Home component at the root path', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<Home pathSegment='' />} />
      </Routes>
    </MemoryRouter>
  );

  // Check if the Home component is rendered
  expect(screen.getByText(/Welcome to sd plat/i)).toBeInTheDocument();
  expect(screen.getByText(/Beam/i)).toBeInTheDocument();
});