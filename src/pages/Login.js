import React, {useState} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import logo from '../assets/shuttleplay_main_logo.png';

function LoginPage() {
  // 입력 양식을 json 형태로 백엔드 서버에 전달
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();   // form  전송 방지

  try {
    const response = await axios.post('/login', {
      email: email,
      password: password
    }, {
      headers: { 'Content-Type' : 'application/json' },
      withCredentials: true   // 세션 쿠키 전달
    });

    alert(response.data.message);
    navigate('/main');    // 로그인 성공 시 메인화면으로 이동
  } catch (error) {
    alert(error.response?.data?.error || '로그인에 실패했습니다.');
  }
};

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </button>

        <Link to="/main">
          <img src={logo} alt="로고" className="logo-img"/>
        </Link>
        <h2 className="subtitle">로그인</h2>

        <form onSubmit={handleLogin} className="login-form">
          <label htmlFor="email">아이디(email)</label>
          <input type="email" id="email" name="email" placeholder="아이디(이메일)" value={email} onChange={(e) => setEmail(e.target.value)} required/>

          <label htmlFor="password">비밀번호</label>
          <input type="password" id="password" name="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required/>

          <div className="options">
            <label><input type="checkbox" name="remember"/>자동로그인</label>
            <a href="#!" className="find-link">정보찾기</a>
          </div>

          <button type="submit" className="login-submit-btn">로그인</button>
        </form>

        <div className="login-divider">
          <hr className="line"/>
          <span className="or">또는</span>
          <hr className="line"/>
        </div>

        <div className="social-buttons-grid">
          <button type="submit" className="social-btn naver">네이버 로그인</button>
          <button type="submit" className="social-btn kakao">카카오 로그인</button>
          <button type="submit" className="social-btn google">구글 로그인</button>
          <button type="submit" className="social-btn apple">애플 로그인</button>
        </div>

        <p className="register-bottom">셔틀플레이가 처음이신가요?
          <Link to="/register" className="register-link">회원가입</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;