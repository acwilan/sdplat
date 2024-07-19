import React from 'react';
import { render } from '@testing-library/react';
import Footer from '../../src/components/Footer';

// Mock the environment variables
process.env.BRANCH = 'main';
process.env.COMMIT_ID = 'abc123';

describe('Footer', () => {
    test('renders footer with branch and commit ID', () => {
    const { getByText } = render(<Footer />);

    // Assert that the branch is rendered correctly
    expect(getByText(/Build from branch: main/i)).toBeInTheDocument();
    // Assert that the commit ID is rendered correctly
    expect(getByText(/Commit ID: abc123/i)).toBeInTheDocument();
    });
});