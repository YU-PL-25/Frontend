import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.css';
import logo from '../assets/shuttleplay_main_logo.png';

function LoginPage() {


  return (
    <div className="login-wrapper">
      <Link to="/main" className="Back-btn">이전</Link>
      <Link to="/main">
        <img src={logo} alt="로고" className="logo-img" />
      </Link>
      <h2 className="subtitle">로그인</h2>

      <form method="POST" action="/login" className="login-form">
        <label htmlFor="username">아이디</label>
        <input type="text" id="username" name="username" placeholder="아이디" required />

        <label htmlFor="password">비밀번호</label>
        <input type="password" id="password" name="password" placeholder="비밀번호" required />

        <div className="options">
          <label><input type="checkbox" name="remember" /> 자동로그인</label>
          <a href="#!" className="find-link">정보찾기</a>
        </div>

        <button type="submit" className="login-btn">로그인</button>
      </form>

      <div className="social-buttons-grid">
        <form action="https://nid.naver.com/oauth2.0/authorize" method="GET">
          <button type="submit" className="social-btn naver">N 네이버 로그인</button>
        </form>
        <form action="https://kauth.kakao.com/oauth/authorize" method="GET">
          <button type="submit" className="social-btn kakao">💬 카카오 로그인</button>
        </form>
        <form action="https://accounts.google.com/o/oauth2/v2/auth" method="GET">
          <button type="submit" className="social-btn google">G 구글 로그인</button>
        </form>
        <form action="https://appleid.apple.com/auth/authorize" method="GET">
          <button type="submit" className="social-btn apple"> 애플 로그인</button>
        </form>
      </div>

      <a href="/signup" className="signup-link">회원가입</a>
    </div>
  );
}

export default LoginPage;