
import React, { useState } from 'react';


interface FooterProps {
  currentPage: string;
  heightClass: string;
}

const Footer: React.FC<FooterProps> = ({
    currentPage='Homepage',
    heightClass="h-40",
  }) => {

  const rootStyle = `fixed bottom-0 w-full ${heightClass} bg-slate-200 p-4`
  return (
    <>
      <div className={rootStyle}>
      
      </div>
    </>
  )
}

export default Footer;