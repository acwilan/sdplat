// test/components/Sidebar.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Sidebar from '../../src/components/Sidebar';

describe('Sidebar', () => {
  test('should toggle sidebar when button is clicked', () => {
    const { getByRole } = render(<Sidebar pathSegment='' />);
    const button = getByRole('button', { name: 'Toggle Sidebar' });

    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('should persist sidebar state to local storage', () => {
    const { getByRole } = render(<Sidebar pathSegment='' />);
    const button = getByRole('button', { name: 'Toggle Sidebar' });
    let storedValue = localStorage.getItem('sidebarCollapsed');
    const expectedValue = storedValue ? !JSON.parse(storedValue) : false;

    fireEvent.click(button);

    storedValue = localStorage.getItem('sidebarCollapsed');
    const actualValue = !JSON.parse(storedValue || '');
    expect(expectedValue).toBe(!actualValue);
  });
});
