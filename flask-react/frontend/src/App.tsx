import React from 'react';
import './App.css';
import { Homepage } from './pages';
import { NavBar, Footer } from './components';

function App() {
  return (
    <>
      <div className="justify-between">
        <NavBar />
        <Homepage 
          datasetName="extracted_frames"
        />
        <Footer />
      </div>
    </>
  );
}

export default App;
