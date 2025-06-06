import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/CurrentMatching.css';
import axios from 'axios';

function CurrentMatching() {
  const [gameRooms, setGameRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 5;
  const indexOfLast = currentPage * roomsPerPage;
  const indexOfFirst = indexOfLast - roomsPerPage;
  const currentRooms = gameRooms.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(gameRooms.length / roomsPerPage));
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    userLocation: '',
    latitude: '',
    longitude: '',
    courtName: '',
    courtAddress: ''
  });

  const fetchRooms = async () => {
    try {
      const response = await axios.get('/api/game-room', { withCredentials: true });
      if (response.data.status === 200) {
        setGameRooms(response.data.data);
      } else {
        console.error('API 응답 오류:', response.data.message);
      }
    } catch (err) {
      console.error('게임방 목록 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    console.log("방 생성 요청 데이터:", formData);
    setShowModal(false);
  };

  return (
    <div className="cml-wrapper">
      <Header/>

      <div className="cml-content">
        <div className="cml-body-wrapper">
          <div className="cml-header-box">
            <div className="cml-header">
              <div className="cml-header-left">
                <h2 className="cml-title">현장 매칭 모드</h2>
                <p className="cml-subtitle">
                  현장에서 원하는 방에 들어가 자동 또는 수동으로 게임 매칭을 잡아보세요.
                </p>
              </div>
            </div>
          </div>

          <div className="cml-room-list-box">
            <div className="cml-room-list-header">
              <button className="cml-create-room-btn" onClick={() => setShowModal(true)}>+ 방 생성</button>
            </div>

            <div className="cml-room-list">
              {currentRooms.map((room) => (
                <div className="cml-room-card" key={room.gameRoomId}>
                  <div className="cml-room-info">
                    <h3>{room.title}</h3>
                    <p>현재 인원: {room.participants?.length || 0}명</p>
                    <p>
                      {room.location?.courtName} · {room.location?.userLocation} · {room.date}
                    </p>
                  </div>
                  <div className="cml-room-actions">
                    <button className="cml-join-btn">방 참가</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cml-pagination">
              <button onClick={handlePrev} disabled={currentPage === 1}>이전</button>
              <span>{currentPage} / {totalPages}</span>
              <button onClick={handleNext} disabled={currentPage === totalPages}>다음</button>
            </div>
          </div>
        </div>
      </div>

      <Footer/>

      {showModal && (
        <div className="cml-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="cml-modal" onClick={(e) => e.stopPropagation()}>
            <h3>현장 게임방 생성</h3>
            <input name="title" placeholder="게임방 제목" value={formData.title} onChange={handleInputChange}/>
            <input name="userLocation" placeholder="지역명" value={formData.userLocation} onChange={handleInputChange}/>
            <input name="latitude" placeholder="위도" value={formData.latitude} onChange={handleInputChange}/>
            <input name="longitude" placeholder="경도" value={formData.longitude} onChange={handleInputChange}/>
            <input name="courtName" placeholder="체육관 이름" value={formData.courtName} onChange={handleInputChange}/>
            <input name="courtAddress" placeholder="체육관 주소" value={formData.courtAddress} onChange={handleInputChange}/>
            <button onClick={handleCreate}>방 생성</button>
            <button className="cml-close-btn" onClick={() => setShowModal(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrentMatching;
