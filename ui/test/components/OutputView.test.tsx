import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OutputView, { OutputType } from '../../src/components/OutputView'; 

describe('OutputView Component', () => {
  test('renders the message with correct variant', () => {
    render(<OutputView message="Test message" outputType={OutputType.IMAGE} messageType="success" />);
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveTextContent('Test message');
    expect(alertElement).toHaveClass('alert-success');
  });

  test('renders the image with correct src attribute', async () => {
    render(<OutputView outputType={OutputType.AUDIO} outputUrl="https://example.com/test.wav" />);
    const audioElement = await screen.findByTestId('audio-element');
    const sourceElement = audioElement.querySelector('source');
    expect(sourceElement).toHaveAttribute('src', 'https://example.com/test.wav');
  });

  test('toggles image size on click', () => {
    render(<OutputView outputType={OutputType.IMAGE} outputUrl="https://example.com/test.jpg" />);
    const imageElement = screen.getByRole('img');
    const containerDiv = imageElement.closest('.image-container');
    
    // Initially, the container div should have the class fit-screen
    expect(containerDiv).toHaveClass('fit-screen');
    
    // Click the image to toggle its size
    fireEvent.click(imageElement);
    
    // Now, the container div should have the class full-size
    expect(containerDiv).toHaveClass('full-size');
    
    // Click the image again to toggle its size back
    fireEvent.click(imageElement);
    
    // The container div should have the class fit-screen again
    expect(containerDiv).toHaveClass('fit-screen');
  });

  test('does not render Alert if message is not provided', () => {
    render(<OutputView outputType={OutputType.IMAGE} />);
    const alertElement = screen.queryByRole('alert');
    expect(alertElement).not.toBeInTheDocument();
  });

  test('does not render Image if imageUrl is not provided', () => {
    render(<OutputView outputType={OutputType.IMAGE} />);
    const imageElement = screen.queryByRole('img');
    expect(imageElement).not.toBeInTheDocument();
  });
});
