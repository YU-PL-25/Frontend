import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/PreMatching.css';
import logo from '../assets/shuttleplay_main_logo.png';
import AutoGameRoomMatching from './AutoGameRoomMatching';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 🟣 모달 컴포넌트 (구장/동네 생성 전환 가능, 버튼 중앙정렬 & 고정 너비)
function PreMatchingCreateRoomModal({ open, onClose, onCreate }) {
  const [mode, setMode] = useState('구장'); // '동네' or '구장'
  // 구장 입력폼
  const [formGym, setFormGym] = useState({
    venue: '',
    address: '',
    latitude: '',
    longitude: '',
    courtName: '',
    courtAddress: '',
    date: '',
    time: '',
    type: '단식',
  });
  // 동네 입력폼
  const [formLocal, setFormLocal] = useState({
    location: '',
    latitude: '',
    longitude: '',
    date: '',
    time: '',
    type: '단식',
  });

  React.useEffect(() => {
    if (open) {
      setMode('구장');
      setFormGym({
        venue: '',
        address: '',
        latitude: '',
        longitude: '',
        courtName: '',
        courtAddress: '',
        date: '',
        time: '',
        type: '단식',
      });
      setFormLocal({
        location: '',
        latitude: '',
        longitude: '',
        date: '',
        time: '',
        type: '단식',
      });
    }
  }, [open]);

  if (!open) return null;

  // 입력 변경 핸들러
  const handleChangeGym = e => {
    const { name, value } = e.target;
    setFormGym(prev => ({ ...prev, [name]: value }));
  };
  const handleChangeLocal = e => {
    const { name, value } = e.target;
    setFormLocal(prev => ({ ...prev, [name]: value }));
  };

  // 생성
  const handleSubmit = e => {
    e.preventDefault();
    if (mode === '구장') onCreate({ ...formGym, mode: '구장매칭' });
    else onCreate({ ...formLocal, mode: '동네매칭' });
    onClose();
  };

  return (
    <div className="pre-modal-backdrop">
      <div className="pre-modal">
        <div style={{
          display: 'flex',
          gap: 12,
          marginBottom: 20,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <button
            className={`pre-modal-mode-btn${mode === '구장' ? ' selected' : ''}`}
            onClick={() => setMode('구장')}
            type="button"
          >구장 게임방 생성</button>
          <button
            className={`pre-modal-mode-btn${mode === '동네' ? ' selected' : ''}`}
            onClick={() => setMode('동네')}
            type="button"
          >동네 게임방 생성</button>
        </div>
        <form onSubmit={handleSubmit} className="pre-modal-form">
          {mode === '구장' ? (
            <>
              <input name="venue" placeholder="장소명" value={formGym.venue} onChange={handleChangeGym} required />
              <input name="address" placeholder="지역명" value={formGym.address} onChange={handleChangeGym} required />
              <input name="latitude" placeholder="위도" value={formGym.latitude} onChange={handleChangeGym} required />
              <input name="longitude" placeholder="경도" value={formGym.longitude} onChange={handleChangeGym} required />
              <input name="courtName" placeholder="체육관 이름" value={formGym.courtName} onChange={handleChangeGym} required />
              <input name="courtAddress" placeholder="체육관 주소" value={formGym.courtAddress} onChange={handleChangeGym} required />
              <input name="date" type="date" placeholder="날짜" value={formGym.date} onChange={handleChangeGym} required />
              <input name="time" type="time" placeholder="시간" value={formGym.time} onChange={handleChangeGym} required />
              <select name="type" value={formGym.type} onChange={handleChangeGym}>
                <option value="단식">단식</option>
                <option value="복식">복식</option>
              </select>
            </>
          ) : (
            <>
              <input name="location" placeholder="동네(지역명)" value={formLocal.location} onChange={handleChangeLocal} required />
              <input name="latitude" placeholder="위도" value={formLocal.latitude} onChange={handleChangeLocal} required />
              <input name="longitude" placeholder="경도" value={formLocal.longitude} onChange={handleChangeLocal} required />
              <input name="date" type="date" placeholder="날짜" value={formLocal.date} onChange={handleChangeLocal} required />
              <input name="time" type="time" placeholder="시간" value={formLocal.time} onChange={handleChangeLocal} required />
              <select name="type" value={formLocal.type} onChange={handleChangeLocal}>
                <option value="단식">단식</option>
                <option value="복식">복식</option>
              </select>
            </>
          )}
          <button className="pre-modal-create-btn" type="submit">방 생성</button>
          <button className="pre-modal-cancel-btn" type="button" onClick={onClose}>닫기</button>
        </form>
      </div>
    </div>
  );
}

// 샘플 데이터 및 자동방 생성 함수(기존)
const sampleVenues = [
  { name: '옥산배드민턴장', address: '경북 경산시 옥산로 120', lat: 35.816742, lng: 128.742983 },
  { name: '삼성현공원 배드민턴장', address: '경북 경산시 삼성현로 45', lat: 35.831201, lng: 128.73012 },
  { name: '영남대 실내체육관', address: '경북 경산시 대학로 280', lat: 35.883733, lng: 128.813515 },
  { name: '경일대 체육관', address: '경북 경산시 하양읍 가마실길 51', lat: 35.9153, lng: 128.81895 },
];

function generateGameRooms(selectedMode, selectedVenue, selectedDate, selectedTime, selectedType) {
  const types = ['단식', '복식'];
  return Array.from({ length: 12 }, (_, idx) => ({
    id: idx + 1,
    venue: sampleVenues[idx % sampleVenues.length],
    date: selectedDate || '2025-06-10',
    time: selectedTime || ['09:00', '11:00', '14:00', '18:00'][idx % 4],
    type: selectedType === '전체' ? types[idx % 2] : selectedType,
    players: types[idx % 2] === '단식' ? 2 : 4,
    status: '모집중',
    distance: 200 + idx * 10,
    mode: selectedMode,
  }));
}

function PreMatching() {
  const navigate = useNavigate();
  const [step, setStep] = useState('selectMode');
  const [selectedMode, setSelectedMode] = useState('구장매칭');
  const [selectedVenue, setSelectedVenue] = useState(sampleVenues[0].name);
  const [selectedDate, setSelectedDate] = useState('2025-06-10');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedType, setSelectedType] = useState('전체');
  const [filtered, setFiltered] = useState(false);
  const [liked, setLiked] = useState(Array(12).fill(false));
  const [createdRooms, setCreatedRooms] = useState([]);
  const [filterKey, setFilterKey] = useState(0);
  const [filterParams, setFilterParams] = useState({
    mode: '구장매칭',
    venue: sampleVenues[0].name,
    date: '2025-06-10',
    time: '09:00',
    type: '전체'
  });

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    timeOptions.push(`${hour.toString().padStart(2, '0')}:00`);
    timeOptions.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  const baseRooms = filtered
    ? generateGameRooms(filterParams.mode, filterParams.venue, filterParams.date, filterParams.time, filterParams.type)
    : [];

  const filteredCreatedRooms = filtered
    ? createdRooms.filter(room =>
        room.mode === filterParams.mode &&
        (
          room.mode === '구장매칭'
            ? room.venue && room.venue.name === filterParams.venue
            : true // 동네매칭은 venue가 없으니 pass
        ) &&
        room.date === filterParams.date &&
        room.time === filterParams.time &&
        (filterParams.type === '전체' || room.type === filterParams.type)
      )
    : [];

  const handleEnter = (room) => {
    localStorage.setItem('selectedRoom', JSON.stringify(room));
  };

  const handleAutoMatching = () => setStep('autoInput');
  const handleAutoMatchClose = () => setStep('selectMode');

  // 모달 오픈
  const handleCreateRoomModalOpen = () => setCreateModalOpen(true);

  // 생성
  const handleCreateRoomModalSubmit = (form) => {
    let newRoom;
    if (form.mode === '구장매칭') {
      newRoom = {
        id: 1000 + createdRooms.length,
        venue: {
          name: form.venue,
          address: form.address,
          lat: Number(form.latitude),
          lng: Number(form.longitude)
        },
        date: form.date,
        time: form.time,
        type: form.type,
        players: form.type === '복식' ? 4 : 2,
        status: '모집중',
        distance: 0,
        mode: '구장매칭',
      };
    } else {
      newRoom = {
        id: 2000 + createdRooms.length,
        location: form.location,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        date: form.date,
        time: form.time,
        type: form.type,
        players: form.type === '복식' ? 4 : 2,
        status: '모집중',
        distance: 0,
        mode: '동네매칭',
      };
    }
    setCreatedRooms(prev => [newRoom, ...prev]);
    setFiltered(true);
    setFilterKey(prev => prev + 1);
    setStep('filter');
    localStorage.setItem('selectedRoom', JSON.stringify(newRoom));
    navigate(`/current-matching/gameroom/${newRoom.id}`);
  };

  const getBtnClass = (active) =>
    "pre-select-mode-btn" + (active ? " pre-select-active" : "");

  return (
    <div className="pre-matching-wrapper">
      <Header />

      <div className="pre-body-center">
      <PreMatchingCreateRoomModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateRoomModalSubmit}
      />

      {step === 'selectMode' && (
        <div className="pre-select-mode-card">
          <img src={logo} alt="ShuttlePlay 로고" className="pre-card-logo" />
          <div className="pre-card-content">
            <h2>매칭 방식을 선택해주세요!</h2>
            <div className="pre-select-mode-buttons">
              <button className={getBtnClass(step === 'autoInput')} onClick={handleAutoMatching}>자동 매칭</button>
              <button className={getBtnClass(step === 'filter')} onClick={() => setStep('filter')}>수동 매칭</button>
            </div>
          </div>
        </div>
      )}

      {step === 'autoInput' && <AutoGameRoomMatching onClose={handleAutoMatchClose} />}

      {step === 'filter' && (
        <>
          <div className="pre-filter-bar">
            <div className="pre-filter-items" style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="pre-filter-item"><span>매칭유형</span>
                <select value={selectedMode} onChange={e => setSelectedMode(e.target.value)}>
                  <option value="구장매칭">구장매칭</option>
                  <option value="동네매칭">동네매칭</option>
                </select>
              </div>
              <div className="pre-filter-item"><span>장소</span>
                <select value={selectedVenue} onChange={e => setSelectedVenue(e.target.value)}>
                  {sampleVenues.map((v, i) => <option key={i} value={v.name}>{v.name}</option>)}
                </select>
              </div>
              <div className="pre-filter-item"><span>날짜</span>
                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
              </div>
              <div className="pre-filter-item"><span>시간</span>
                <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)}>
                  {timeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="pre-filter-item"><span>종목</span>
                <select value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                  <option value="전체">전체</option>
                  <option value="단식">단식</option>
                  <option value="복식">복식</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="pre-filter-apply-btn" onClick={() => {
                  setFilterParams({
                    mode: selectedMode,
                    venue: selectedVenue,
                    date: selectedDate,
                    time: selectedTime,
                    type: selectedType
                  });
                  setFiltered(true);
                  setFilterKey(prev => prev + 1);
                }}>게임방 리스트 찾기</button>
                <button className="pre-create-btn" onClick={handleCreateRoomModalOpen}>방 생성</button>
              </div>
            </div>
          </div>

          {filtered && (
            <div className="pre-card-grid">
              {[...filteredCreatedRooms, ...baseRooms].map((room, i) => (
                <div className="pre-card" key={`${filterKey}-${room.id}`}>
                  <div className="pre-card-thumbnail">
                    <div className="pre-thumbnail-text">
                      {room.mode === '구장매칭' 
                        ? (room.venue && room.venue.name) 
                        : (room.location || '동네방')}
                    </div>
                    <button className={`pre-heart-button ${liked[i] ? 'liked' : ''}`} onClick={() => {
                      const updated = [...liked];
                      updated[i] = !updated[i];
                      setLiked(updated);
                    }}>❤︎</button>
                  </div>
                  <div className="pre-card-body">
                    <h4>
                      {room.mode === '구장매칭' 
                        ? (room.venue && room.venue.name)
                        : (room.location || '동네방')}
                    </h4>
                    <div className="pre-alt-info">
                      {room.mode === '구장매칭' ? (
                        <>
                          <div>주소: {room.venue.address}</div>
                        </>
                      ) : (
                        <>
                          <div>동네: {room.location}</div>
                        </>
                      )}
                      <div>거리: {room.distance}m</div>
                      <div>날짜: {room.date}</div>
                      <div>시간: {room.time}</div>
                      <div>종목: {room.type}</div>
                      <div>정원: {room.players}명</div>
                      <div>상태: {room.status}</div>
                    </div>
                    <div className="pre-card-bottom">
                      <Link to={`/pre-matching/gameroom/${room.id}`} onClick={() => handleEnter(room)}>
                        <button className="pre-enter-btn">입장</button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <Footer />
      </div>
    </div>
  );
}

export default PreMatching;
