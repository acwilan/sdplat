import React, { useState } from 'react';
import { Alert, Image } from 'react-bootstrap';

interface OutputViewProps {
  message?: string;
  messageType?: 'success' | 'danger' | 'info';
  imageUrl?: string;
}

const OutputView: React.FC<OutputViewProps> = ({ message, messageType, imageUrl }) => {
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
      {imageUrl && (
        <div className={`image-container ${fullSize ? 'full-size' : 'fit-screen'}`}>
          <Image
            src={imageUrl}
            fluid={!fullSize}
            onClick={handleImageClick}
            style={{ cursor: 'pointer' }}
          />
        </div>
      )}
    </div>
  );
};

export default OutputView;
