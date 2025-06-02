import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/MyPage.css';

function MyPage() {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace/>;
  }

  return (
    <div className="mypage-page-wrapper">
      <Header/>

      <div className="mypage-page-content">
        <div className="mypage-container">
          <h2 className="mypage-title">내 정보</h2>

          <div className="mypage-info">
            <div className="info-row">
              <span className="info-label">이름</span>
              <span className="info-value">{user.name || '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">이메일</span>
              <span className="info-value">{user.email || '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">전화번호</span>
              <span className="info-value">{user.phone || '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">닉네임</span>
              <span className="info-value">{user.nickname || '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">성별</span>
              <span className="info-value">{user.gender || '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">급수</span>
              <span className="info-value">{user.rank || '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">연령대</span>
              <span className="info-value">{user.profile.ageGroup || '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">플레이 스타일</span>
              <span className="info-value">{user.profile.playStyle || '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">게임 타입</span>
              <span className="info-value">{user.profile.gameType || '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">MMR</span>
              <span className="info-value">{user.mmr.rating}</span>
            </div>

            <div className="info-row">
              <span className="info-label">게임 횟수</span>
              <span className="info-value">{user.mmr.gamesPlayed}</span>
            </div>

            <div className="info-row">
              <span className="info-label">승리 횟수</span>
              <span className="info-value">{user.mmr.winsCount}</span>
            </div>

            <div className="info-row">
              <span className="info-label">승률</span>
              <span className="info-value">{Math.round(user.mmr.winRate * 100)}%</span>
            </div>
          </div>

          <div className="mypage-actions">
            <button className="action-btn">게임 스타일 수정</button>
            <button className="action-btn">개인 정보 수정</button>
            <button className="action-btn">비밀번호 변경</button>
            <button className="action-btn">작성 내역 조회</button>
            <button className="action-btn">경기 내역 조회</button>
            <button className="action-btn">참가중인 매칭 조회</button>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}

export default MyPage;
