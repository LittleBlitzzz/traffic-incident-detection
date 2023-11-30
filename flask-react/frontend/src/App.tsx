import React from 'react';
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import './App.css';
import { Homepage, AnnotatorPage, ModelInterfacePage, PageNotFound } from './pages';
import { NavBar, Footer } from './components';

function App() {
  return (
    <BrowserRouter>
      <div className="justify-between">
        <NavBar />
        <div id="main-body-content" className="mb-40">
          <Routes>
            <Route path="/" exact element={
              <Homepage />
            } />
            <Route path="/annotator" exact element={
              <AnnotatorPage 
                datasetName="extracted_frames" 
              />
            } /> 
            <Route path="/model-interface" exact element={
              <ModelInterfacePage />
            } />
            <Route path="*" element={
              <PageNotFound />
            } />
          </Routes>
        </div>
        
        <Outlet />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;