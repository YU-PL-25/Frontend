import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import logoImage from '../assets/shuttleplay_main_logo.png';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/main">
          <img src={logoImage} alt="ShuttlePlay Logo" className="logo-image"/>
        </Link>
      </div>

      <nav className="header-center">
        <ul className="nav-menu">
          <li><Link to="/pre-matching">사전 매칭</Link></li>
          <li><Link to="/current-matching">현장 매칭</Link></li>
          <li><Link to="/competition">대회 관리</Link></li>
          <li><Link to="/reservation">구장 예약</Link></li>
          <li><Link to="/club">모임 관리</Link></li>
          <li><Link to="/community">커뮤니티</Link></li>
        </ul>
      </nav>

      <div className="header-right">
        <i className="bi bi-chat-dots" title="채팅"></i>
        <i className="bi bi-bell" title="알림"></i>
        <button className="login-btn">
          <Link to="/login" className="login-link">로그인</Link>
        </button>
      </div>
    </header>
  );
}

export default Header;