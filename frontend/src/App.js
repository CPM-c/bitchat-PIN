import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MiningDashboard from './components/MiningDashboard';
import { Toaster } from './components/ui/toaster';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<MiningDashboard />} />
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}

export default App;