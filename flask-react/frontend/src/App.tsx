import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { Homepage, AnnotatorPage, ModelInterfacePage, PageNotFound } from './pages';
import { NavBar, Footer } from './components';

function App() {
  return (
    <Router>
      <div className="justify-between">
        <NavBar />
        <Switch>
          <Route path="/" exact>
            <Homepage />
          </Route>
          <Route path="/annotator" exact>
            <AnnotatorPage 
              datasetName="extracted_frames" 
            />
          </Route>
          <Route path="/model-interface" exact>
            <ModelInterfacePage />
          </Route>
          <Route path="*">
            <PageNotFound />
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;