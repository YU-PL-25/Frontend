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
import MyPage from './pages/MyPage';
import MatchHistory from './pages/MatchHistory';
import CurrentMatchingGameRoom from './pages/CurrentMatchingGameRoom';
import PreMatchingGameRoom from './pages/PreMatchingGameRoom';
// GameRoomDetail은 당분간 사용 안 함 (불필요하면 import만 남겨둬도 됨)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/main" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/success" element={<RegisterSuccess />} />
        <Route path="/pre-matching" element={<PreMatching />} />
        <Route path="/current-matching" element={<CurrentMatching />} />
        <Route path="/competition" element={<Competition />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/club" element={<Club />} />
        <Route path="/community" element={<Community />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/match-history" element={<MatchHistory />} />

        {/* 사전매칭 방 상세 */}
        <Route path="/pre-matching/gameroom/:roomId" element={<PreMatchingGameRoom />} />

        {/* 현장매칭 방 상세 */}
        <Route path="/current-matching/gameroom/:roomId" element={<CurrentMatchingGameRoom />} />

        {/* (아래는 필요할 때만 잠깐 해제해서 사용)
        <Route path="/pre-matching/gameroom/:id" element={<GameRoomDetail />} />
        */}
      </Routes>
    </Router>
  );
}

export default App;
