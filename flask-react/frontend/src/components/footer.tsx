
import React, { useState } from 'react';


interface FooterProps {
  currentPage: string;
}

const Footer: React.FC<FooterProps> = ({
    currentPage='Homepage',
  }) => {
  return (
    <>
      <div className='h-40 bg-slate-200'>

      </div>
    </>
  )
}

export default Footer;