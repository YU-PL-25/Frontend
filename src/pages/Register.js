import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Register.css';
import logo from '../assets/shuttleplay_main_logo.png';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    nickname: '',
    gender: '',
    loginId: '',
    email: '',
    phone: '',
    password: '',
    rankStr: '',
    ageGroup: '',
    playStyle: '',
    gameType: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const next = () => {
    const { name, loginId, email, phone, password, nickname } = form;
    const nameReg  = /^[가-힣a-zA-Z]{2,}$/;
    const idReg = /^[a-z][a-z0-9._]{3,19}$/;
    const emailReg = /^[\w.+-]+@[a-z\d-]+(\.[a-z\d-]+)+$/i;
    const phoneReg = /^01[016789]-\d{3,4}-\d{4}$/;
    const passReg  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    const forbiddenWords = ['admin', 'root', 'master', 'test', 'staff', 'null'];
    
    if (!name || !loginId || !email || !phone || !password || !nickname) {
      setError('모든 필수 항목을 입력해 주세요.');
      return;
    }

    if (!nameReg.test(name)) {
      setError('이름은 한글·영문 2자 이상이어야 합니다.');
      return;
    }

    function isForbiddenId(loginId) {
      return forbiddenWords.some(word => loginId.toLowerCase().includes(word));
    }

    if (!idReg.test(loginId)) {
      setError('아이디는 영문 소문자로 시작, 4~20자 이내의 영문/숫자/밑줄/마침표만 사용할 수 있습니다.');
      return;
    } else if (isForbiddenId(loginId)) {
      setError('사용할 수 없는 단어가 포함된 아이디입니다.');
      return;
    }

    if (!emailReg.test(email)) {
      setError('이메일 형식이 올바르지 않습니다.');
      return;
    }

    if (!phoneReg.test(phone)) {
      setError('전화번호 형식이 010-1234-5678 이어야 합니다.');
      return;
    }

    if (!passReg.test(password)) {
      setError('비밀번호는 8-20자, 영문 대소문자·숫자·특수문자를 모두 포함해야 합니다.');
      return;
    }

    setError('');
    setStep(2);
  };

  const back = () => setStep(1);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/users/register', form);
      navigate('/register/success');
    } catch (err) {
      setError('회원가입에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="register-page">
      <button type="button" className="Back-btn" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i>
      </button>

      <div className="register-wrapper">
        <Link to="/main">
          <img src={logo} alt="로고" className="logo-img"/>
        </Link>

        <h2 className="subtitle">회원가입</h2>

        <div className="progress-bar">
          <div className="progress" style={{ width: step === 1 ? '50%' : '100%' }}/>
        </div>

        {step === 1 && (
          <form className="register-form" onSubmit={e => e.preventDefault()}>
            <label htmlFor="name">이름</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="홍길동" required/>

            <label htmlFor="loginId">아이디</label>
            <input id="loginId" name="loginId" value={form.loginId} onChange={handleChange} placeholder="영문 소문자로 시작, 4-20자, 영문·숫자·특수문자(_)·(.)·(@)만 허용" required/>

            <label htmlFor="email">이메일</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="abcd@abcd.com" required/>

            <label htmlFor="phone">전화번호</label>
            <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="010-1234-5678" required/>

            <label htmlFor="password">비밀번호</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="8-20자, 대/소문자·숫자·특수문자 모두 포함" required/>

            <label htmlFor="nickname">닉네임</label>
            <input id="nickname" name="nickname" value={form.nickname} onChange={handleChange} required/>

            {error && <p className="form-error">{error}</p>}

            <div className="btn-right">
              <button type="button" className="primary-btn" onClick={next}>다음</button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="register-form" onSubmit={handleSubmit}>
            <label htmlFor="gender">성별</label>
            <select id="gender" name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">선택</option>
              <option value="남">남</option>
              <option value="여">여</option>
            </select>

            <label htmlFor="ageGroup">연령대</label>
            <select id="ageGroup" name="ageGroup" value={form.ageGroup} onChange={handleChange} required>
              <option value="">선택</option>
              <option value="10대">10대</option>
              <option value="20대">20대</option>
              <option value="30대">30대</option>
              <option value="40대">40대</option>
              <option value="50대">50대</option>
              <option value="60대">60대</option>
              <option value="70대">70대</option>
            </select>

            <label htmlFor="rankStr">급수</label>
            <select id="rankStr" name="rankStr" value={form.rankStr} onChange={handleChange} required>
              <option value="">선택</option>
              <option value="E">E</option>
              <option value="D">D</option>
              <option value="C">C</option>
              <option value="B">B</option>
              <option value="A">A</option>
              <option value="S">S</option>
              <option value="SS">SS</option>
            </select>

            <label htmlFor="playStyle">플레이 스타일</label>
            <select id="playStyle" name="playStyle" value={form.playStyle} onChange={handleChange} required>
              <option value="">선택</option>
              <option value="즐겜">즐겜</option>
              <option value="승부욕">빡겜</option>
            </select>

            <label htmlFor="gameType">게임 타입</label>
            <select id="gameType" name="gameType" value={form.gameType} onChange={handleChange} required>
              <option value="">선택</option>
              <option value="단식">단식</option>
              <option value="복식">복식</option>
            </select>

            <div className="step-btn-group">
              <button type="button" className="secondary-btn" onClick={back}>이전</button>
              <button type="submit" className="primary-btn">가입</button>
            </div>
          </form>
        )}

        <p className="login-bottom">이미 계정이 있으신가요?
          <Link to="/login" className="login-bottom-link">로그인</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
