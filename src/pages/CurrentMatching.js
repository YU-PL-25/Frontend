import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/CurrentMatching.css';

function Reservation() {
  const dummyRooms = [
    { id: 1, title: '강남구 실내체육관 1번방', address: '서울 강남구 영동대로 123', players: 4 },
    { id: 2, title: '서초구 국민체육센터 A코트', address: '서울 서초구 반포대로 45', players: 6 },
    { id: 3, title: '송파구 배드민턴장 메인홀', address: '서울 송파구 중대로 100', players: 2 },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 5;
  const totalPages = Math.ceil(dummyRooms.length / roomsPerPage);
  const indexOfLast = currentPage * roomsPerPage;
  const indexOfFirst = indexOfLast - roomsPerPage;
  const currentRooms = dummyRooms.slice(indexOfFirst, indexOfLast);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    userLocation: '',
    latitude: '',
    longitude: '',
    courtName: '',
    courtAddress: ''
  });

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
                <div className="cml-room-card" key={room.id}>
                  <div className="cml-room-info">
                    <h3>{room.title}</h3>
                    <p>{room.address}</p>
                    <p>현재 인원: {room.players}명</p>
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

export default Reservation;
