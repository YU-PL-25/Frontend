import React from "react";
import "../styles/GameRoomDetail.css";
import { useParams, useNavigate } from "react-router-dom";

const GameRoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const selectedRoom = JSON.parse(localStorage.getItem("selectedRoom"));

  if (!selectedRoom || parseInt(id) !== selectedRoom.id) {
    return (
      <div className="gameroom-detail">
        <div className="detail-header">
          <div className="header-content">
            <button className="back-button" onClick={() => navigate(-1)}>
              ← 뒤로가기
            </button>
          </div>
        </div>
        <main className="detail-container">
          <h2>존재하지 않는 게임방입니다.</h2>
        </main>
      </div>
    );
  }

  return (
    <div className="gameroom-detail">
      <header className="detail-header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← 뒤로가기
          </button>
          <div className="room-status-badge">
            <div className="status-indicator waiting" />
            대기 중
          </div>
        </div>
      </header>

      <main className="detail-container">
        <div className="main-content">
          <section className="room-info-section">
            <div className="room-header">
              <h2 className="room-title">{selectedRoom.title} 🏸</h2>
              <div className="room-meta">
                <span>거리: {selectedRoom.distance}</span>
                <span>{selectedRoom.date}</span>
                <span>인원: {selectedRoom.players}</span>
                <span className="game-type">{selectedRoom.gameType}</span>
              </div>
            </div>

            <div className="room-details">
              <div className="detail-card court-info">
                <h3>코트 정보</h3>
                <p>위치: {selectedRoom.location}</p>
                <p>코트 번호: 3번</p>
              </div>
              <div className="detail-card">
                <h3>게임 규칙</h3>
                <ul className="rules-list">
                  <li>21점 1세트</li>
                  <li>3분 대기시간 초과 시 자동 패배</li>
                  <li>심판 없음 (자체진행)</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="teams-section">
            <h3 className="section-title">팀 구성</h3>
            <div className={selectedRoom.gameType.includes("단식") ? "singles-container" : "teams-container"}>
              <div className="team-card">
                <h4 className="team-title">내 팀</h4>
                <div className="team-players">
                  <div className="player-card">
                    <div className="player-avatar">
                      <div className="avatar-circle large" style={{ background: "#af1aaa" }}>주</div>
                      <div className="host-badge">👑</div>
                    </div>
                    <div className="player-info">
                      <p className="player-name">김주영</p>
                      <p className="skill-level">중급자</p>
                      <div className="player-status">
                        <span className="ready-indicator ready">READY</span>
                      </div>
                    </div>
                  </div>
                  {selectedRoom.gameType.includes("복식") && (
                    <div className="empty-slot">
                      <div className="empty-avatar large">+</div>
                      <div>팀원 모집 중</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="vs-divider">
                <span className="vs-text">VS</span>
              </div>

              <div className="team-card">
                <h4 className="team-title">상대 팀</h4>
                <div className="team-players">
                  <div className="empty-slot">
                    <div className="empty-avatar large">+</div>
                    <div>상대 모집 중</div>
                  </div>
                  {selectedRoom.gameType.includes("복식") && (
                    <div className="empty-slot">
                      <div className="empty-avatar large">+</div>
                      <div>상대 모집 중</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="actions-section">
            <div className="action-buttons">
              <button className="ready-button">준비</button>
              <button className="start-button" disabled>게임 시작</button>
              <button className="leave-button" onClick={() => navigate(-1)}>나가기</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default GameRoomDetail;
