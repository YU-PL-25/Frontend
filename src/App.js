import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import Landing from './pages/Landing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" replace/>}/>
        <Route path="/landing" element={<Landing/>}/>
      </Routes>
    </Router>
  );
}

export default App;
