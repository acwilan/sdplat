import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Footer from '../../src/components/Footer';

// Mock the environment variables
process.env.BRANCH = 'main';
process.env.COMMIT_ID = 'abc123';
process.env.VERSION = '1.0.0';
process.env.BUILD_DATE = '2024-07-19T00:00:00Z';

test('renders footer and toggles visibility', () => {
  const { getByText, queryByText, getByRole } = render(<Footer />);
  const button = getByRole('button', { name: 'Toggle footer' });

  // Initially, the footer content should not be visible
  expect(queryByText(/Build from branch: main/i)).not.toBeInTheDocument();

  // Click the toggle button to show the footer content
  fireEvent.click(button);
  expect(getByText(/Build from branch: main/i)).toBeInTheDocument();
  expect(getByText(/Commit ID: abc123/i)).toBeInTheDocument();
  expect(getByText(/Version: 1.0.0/i)).toBeInTheDocument();
  expect(getByText(/Build Date: 2024-07-19T00:00:00Z/i)).toBeInTheDocument();

  // Click the toggle button again to hide the footer content
  fireEvent.click(button);
  expect(queryByText(/Build from branch: main/i)).not.toBeInTheDocument();
});
