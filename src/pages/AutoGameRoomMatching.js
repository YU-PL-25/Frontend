"use client";

import React, { useState, useEffect } from "react";
import "../styles/AutoGameRoomMatching.css";

const AutoGameRoomMatching = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [matchType, setMatchType] = useState("Neighborhood");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedTime, setSelectedTime] = useState("18:00");
  const [selectedLocation, setSelectedLocation] = useState("downtown");
  const [maxDistance, setMaxDistance] = useState(300);
  const [selectedGameType, setSelectedGameType] = useState("Doubles");
  const [autoGenerationEnabled, setAutoGenerationEnabled] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matchSuccess, setMatchSuccess] = useState(false);
  const [matchedOpponent, setMatchedOpponent] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMatching = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      const dummyOpponent = selectedGameType === "Singles"
        ? [{ name: "김배드민", skill: "Intermediate", distance: 240 }]
        : [
            { name: "김배드민", skill: "Intermediate", distance: 240 },
            { name: "배드맨1", skill: "Advanced", distance: 250 },
            { name: "배드맨2", skill: "Beginner", distance: 260 }
          ];

      setMatchedOpponent(dummyOpponent);
      setMatchSuccess(true);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2000);
    }, 1500);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    window.location.href = "/pre-matching"; // 완전 이동
  };

  const handleLeave = () => {
    window.location.href = "/pre-matching"; // 완전 이동
  };

  return (
    <div className="auto-matching-container">
      <div className="auto-matching-header">
        <h2>자동 GameRoom 매칭</h2>
        <div className="auto-matching-time">🕐 {currentTime.toLocaleTimeString()}</div>
      </div>

      <label className="auto-matching-checkbox">
        <input
          type="checkbox"
          checked={autoGenerationEnabled}
          onChange={(e) => setAutoGenerationEnabled(e.target.checked)}
        />
        자동 게임방 생성 허용
      </label>

      <div className="match-type-buttons">
        <button
          className={`match-type-button ${matchType === "Neighborhood" ? "active" : ""}`}
          onClick={() => setMatchType("Neighborhood")}
        >
          동네매칭
        </button>
        <button
          className={`match-type-button ${matchType === "Court" ? "active" : ""}`}
          onClick={() => setMatchType("Court")}
        >
          구장매칭
        </button>
      </div>

      <div className="auto-matching-grid">
        <div>
          <label className="auto-matching-label">날짜</label>
          <input
            type="date"
            className="auto-matching-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div>
          <label className="auto-matching-label">시간</label>
          <input
            type="time"
            className="auto-matching-input"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          />
        </div>
        <div>
          <label className="auto-matching-label">위치</label>
          <select
            className="auto-matching-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="downtown">Downtown</option>
            <option value="uptown">Uptown</option>
            <option value="midtown">Midtown</option>
            <option value="central-park">Central Park</option>
          </select>
        </div>
        <div>
          <label className="auto-matching-label">최대 거리: {maxDistance}m</label>
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="auto-matching-input"
          />
        </div>
        <div>
          <label className="auto-matching-label">게임 유형</label>
          <select
            className="auto-matching-select"
            value={selectedGameType}
            onChange={(e) => setSelectedGameType(e.target.value)}
          >
            <option value="Singles">단식 (1v1)</option>
            <option value="Doubles">복식 (2v2)</option>
          </select>
        </div>
      </div>

      {/* 버튼 2개 나란히 */}
      <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "20px" }}>
        <button className="create-button" onClick={handleMatching}>
          GameRoom 생성
        </button>
        <button className="leave-button" onClick={handleLeave}>
          나가기
        </button>
      </div>

      <div className="auto-matching-info">
        <p>💡 조건에 맞는 게임방이 자동으로 생성됩니다.</p>
        <ul>
          <li>선택한 날짜와 시간대 기준으로 ±30분</li>
          <li>{maxDistance}m 이내의 위치에서 매칭</li>
          <li>선택한 게임 유형에 따라 인원이 충족되면 자동 생성</li>
        </ul>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>📋 선택한 정보</h3>
            <p>날짜: {selectedDate}</p>
            <p>시간: {selectedTime}</p>
            <p>위치: {selectedLocation}</p>
            <p>거리: {maxDistance}m</p>
            <p>게임 유형: {selectedGameType === "Singles" ? "단식" : "복식"}</p>
            <hr style={{ margin: "16px 0" }} />
            {matchSuccess && matchedOpponent ? (
              <>
                <h4>🧑‍🤝‍🧑 매칭 상대</h4>
                {selectedGameType === "Singles" ? (
                  <p>상대: {matchedOpponent[0].name} ({matchedOpponent[0].skill})</p>
                ) : (
                  <>
                    <p>내 팀: {matchedOpponent[0].name} ({matchedOpponent[0].skill})</p>
                    <p>상대 1: {matchedOpponent[1].name} ({matchedOpponent[1].skill})</p>
                    <p>상대 2: {matchedOpponent[2].name} ({matchedOpponent[2].skill})</p>
                  </>
                )}
              </>
            ) : (
              <p>✨ 매칭 상대 정보를 불러오는 중...</p>
            )}
            <button className="close-button" onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="success-popup">
          🎉 매칭이 성공되었습니다!
        </div>
      )}
    </div>
  );
};

export default AutoGameRoomMatching;
