
import React from 'react';

interface HomepageProps {
}

const Homepage: React.FC<HomepageProps> = ({ }) => {
  return (
    <>
      <div className="px-20">
        <p>Welcome to my Final Year Project!</p>
        <p>This site is used for annotating my dataset</p>
        <p>And also to interface with the LLaVA model (for prompt engineering)</p>
      </div>
    </>
  );
}

export default Homepage;