import React, { useState } from 'react';
import { LoadingSpinner } from './';

interface FetchButtonProps {
  className?: string; 
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => Promise<void>; 
  onLoaded?: () => void; 
  onError?: (error: Error) => void; 
  children: React.ReactNode; 
}

const FetchButton: React.FC<FetchButtonProps> = ({
  className = "form-submit-btn",
  type = "button",
  onClick = null,
  onLoaded = null,
  onError = null,
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = () => {
    setIsLoading(true);

    // Perform the fetch request or any asynchronous operation
    onClick && onClick()
      .then(() => {
        onLoaded && onLoaded();
      })
      .catch((error) => {
        onError && onError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return type === "submit" ? (
    <button type="submit" className={className}>
      <span>{children}</span>
    </button>
  ) : (
    <button
      type={type}
      className={className}
      onClick={handleButtonClick}
      disabled={isLoading}
    >
      {isLoading && <LoadingSpinner />} {/* Display the loading spinner when isLoading is true */}
      <span>{isLoading ? 'Loading...' : children}</span>
    </button>
  );
};

export default FetchButton;
