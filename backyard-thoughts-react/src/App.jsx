import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutMe from './pages/AboutMe';
import LiteraryGarden from './pages/LiteraryGarden';
import CosmologicalGarden from './pages/CosmologicalGarden';
import MusicalGarden from './pages/MusicalGarden';
import './assets/styles/main.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about-me" component={AboutMe} />
          <Route path="/literary-garden" component={LiteraryGarden} />
          <Route path="/cosmological-garden" component={CosmologicalGarden} />
          <Route path="/musical-garden" component={MusicalGarden} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;