import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import Landing from './pages/Landing';
import Main from './pages/Main';
import Login from './pages/Login';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" replace/>}/>
        <Route path="/landing" element={<Landing/>}/>
        <Route path="/main" element={<Main/>}/>
        <Route path='/login' element={<Login/>}/>

      </Routes>
    </Router>
  );
}

export default App;
