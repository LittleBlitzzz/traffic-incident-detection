import React from 'react';
import './App.css';
import { Homepage } from './pages';
import { NavBar, Footer } from './components';

function App() {
  return (
    <>
      <NavBar />
      <Homepage 
        datasetName="extracted_frames"
      />
      <Footer />
    </>
  );
}

export default App;
