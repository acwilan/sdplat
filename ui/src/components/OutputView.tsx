import React, { useState } from 'react';
import { Alert, Image } from 'react-bootstrap';

export enum OutputType {
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
}

interface OutputViewProps {
  message?: string;
  messageType?: 'success' | 'danger' | 'info';
  outputType: OutputType;
  outputUrl?: string;
}

const OutputView: React.FC<OutputViewProps> = ({ message, messageType, outputType, outputUrl }) => {
  const [fullSize, setFullSize] = useState<boolean>(false);

  const handleImageClick = () => {
    setFullSize(!fullSize);
  };

  return (
    <div className="d-flex flex-column align-items-center">
      {message && (
        <Alert variant={messageType} className="w-100">
          {message}
        </Alert>
      )}
      {outputType == OutputType.IMAGE && outputUrl && (
        <div className={`image-container ${fullSize ? 'full-size' : 'fit-screen'}`}>
          <Image
            src={outputUrl}
            fluid={!fullSize}
            onClick={handleImageClick}
            style={{ cursor: 'pointer' }}
          />
        </div>
      )}
      {outputType == OutputType.AUDIO && outputUrl && (
        <audio controls data-testid="audio-element">
          <source src={outputUrl} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default OutputView;
