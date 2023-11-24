import React from 'react';
import './App.css';
import { Homepage } from './pages';
import { NavBar } from './components';

function App() {
  return (
    <>
      <NavBar />
      <Homepage 
        datasetName="extracted_frames"
        currVideoName="000000"
        currFilename="6.jpg"
      />
    </>
  );
}

export default App;
