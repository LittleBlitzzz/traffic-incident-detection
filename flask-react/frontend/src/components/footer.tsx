
import React, { useState } from 'react';


interface FooterProps {
  currentPage?: string;
  heightClass?: string;
}

const Footer: React.FC<FooterProps> = ({
    currentPage='Homepage',
    heightClass="h-[10vh]",
  }) => {

  const rootStyle = `bottom-0 w-screen ${heightClass} bg-slate-300 p-4`
  return (
    <>
      <div className={rootStyle}>
      
      </div>
    </>
  )
}

export default Footer;