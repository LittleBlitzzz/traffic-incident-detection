
import React from 'react';

interface PageNotFoundProps {
}

const PageNotFound: React.FC<PageNotFoundProps> = ({ }) => {
  return (
    <>
      <div className="px-20">
        <p>I'm sorry, this link does not exist!</p>
      </div>
    </>
  );
}

export default PageNotFound;