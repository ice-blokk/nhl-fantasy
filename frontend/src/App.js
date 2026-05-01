import React, {Component} from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom'

import Roster from './pages/Roster'
import Draft from './pages/Draft'
import NavBar from "./components/NavBar";


class App extends Component {
render() {
  return (
    <>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/roster" element={<Roster />} />
          <Route path="/draft" element={<Draft />} />
        </Routes>
      </div>
    </>
  );
}
}

export default App;
