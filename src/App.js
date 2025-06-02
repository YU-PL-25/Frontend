import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import Landing from './pages/Landing';
import Main from './pages/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterSuccess from './pages/RegisterSuccess';
import PreMatching from './pages/PreMatching';
import CurrentMatching from './pages/CurrentMatching';
import Competition from './pages/Competition';
import Reservation from './pages/Reservation';
import Club from './pages/Club';
import Community from './pages/Community';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" replace/>}/>
        <Route path="/landing" element={<Landing/>}/>
        <Route path="/main" element={<Main/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/register/success" element={<RegisterSuccess/>}/>
        <Route path="/pre-matching" element={<PreMatching/>}/>
        <Route path="/current-matching" element={<CurrentMatching/>}/>
        <Route path="/competition" element={<Competition/>}/>
        <Route path="/reservation" element={<Reservation/>}/>
        <Route path="/club" element={<Club/>}/>
        <Route path="/community" element={<Community/>}/>
      </Routes>
    </Router>
  );
}

export default App;
