import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/CurrentMatchingGameRoom.css';
import { MapPin, Clock, Users, UserPlus, Plus, X } from "lucide-react";
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Badge = ({ children, color = "gray" }) => (
  <span className={`cm-badge cm-badge-${color}`}>{children}</span>
);
const Button = ({ children, className = "", ...props }) => (
  <button className={`cm-btn ${className}`} {...props}>{children}</button>
);
const rankColor = {
  SS: "purple",
  S: "red",
  A: "orange",
  B: "yellow",
  C: "green",
  D: "blue",
  E: "gray"
};
const gameTypeLabel = { Singles: "단식", Doubles: "복식" };
const autoNames = [
  "이서준", "김민지", "최시우", "박예린", "정도윤",
  "한유진", "유하린", "신동윤", "노지민", "배도현"
];
const rankLevels = ["SS", "S", "A", "B", "C", "D", "E"];

// 단식/복식 선택 모달 (자동 매칭 등록만)
const SelectTypeModal = ({ open, onClose, onSelect }) => {
  if (!open) return null;
  return (
    <div className="cm-modal-bg">
      <div className="cm-modal-content" style={{maxWidth:330}}>
        <div className="cm-modal-header">
          <b>게임 유형 선택</b>
          <Button className="cm-modal-close" onClick={onClose}><X size={18} /></Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 26, marginBottom: 18 }}>
          <Button onClick={() => { onSelect('Singles'); }} style={{fontWeight:700}}>단식</Button>
          <Button onClick={() => { onSelect('Doubles'); }}>복식</Button>
        </div>
      </div>
    </div>
  );
};

const GameResultModal = ({
  visible, onClose, room, onFinishGame
}) => {
  const [myScore, setMyScore] = useState('');
  const [opponentScore, setOpponentScore] = useState('');

  const myTeam = room?.players?.slice(0, room.gameType === "Singles" ? 1 : 2) || [];
  const opponentTeam = room?.players?.slice(room.gameType === "Singles" ? 1 : 2) || [];

  if (!visible || !room) return null;

  return (
    <div className="cm-modal-bg">
      <div className="cm-modal-content">
        <div className="cm-modal-header">
          <span role="img" aria-label="search" style={{fontSize:18}}>🔍</span>
          <b style={{marginLeft: 7}}>경기 상세 정보</b>
          <Button className="cm-modal-close" onClick={onClose}><X size={18} /></Button>
        </div>
        <div className="cm-modal-detail">
          <div>{room.courtName} / {gameTypeLabel[room.gameType]}</div>
          <div>{room.createdAt.toLocaleDateString()} {room.createdAt.toLocaleTimeString()}</div>
        </div>
        <div className="cm-modal-teams">
          <div className="cm-modal-team">
            <h4>내 팀</h4>
            {myTeam.map(user => (
              <div key={user.id} className="cm-modal-player-row">
                <span className="cm-avatar">{user.name.split(" ").map(n => n[0]).join("")}</span>
                <span>{user.name}</span>
                <Badge color={rankColor[user.rankLevel]}>
                  {user.rankLevel}
                </Badge>
              </div>
            ))}
            <div className="cm-modal-score-input">
              점수: <input
                type="number"
                value={myScore}
                min={0}
                onChange={e => setMyScore(e.target.value)}
                style={{width: 55, marginLeft: 4}}
              />
            </div>
          </div>
          <div className="cm-modal-team">
            <h4>상대 팀</h4>
            {opponentTeam.map(user => (
              <div key={user.id} className="cm-modal-player-row">
                <span className="cm-avatar">{user.name.split(" ").map(n => n[0]).join("")}</span>
                <span>{user.name}</span>
                <Badge color={rankColor[user.rankLevel]}>
                  {user.rankLevel}
                </Badge>
              </div>
            ))}
            <div className="cm-modal-score-input">
              점수: <input
                type="number"
                value={opponentScore}
                min={0}
                onChange={e => setOpponentScore(e.target.value)}
                style={{width: 55, marginLeft: 4}}
              />
            </div>
          </div>
        </div>
        <div className="cm-modal-footer">
          <Button
            className="cm-finish-btn"
            onClick={() => {
              if (myScore === "" || opponentScore === "") {
                alert("양팀 점수를 모두 입력하세요.");
                return;
              }
              onFinishGame(myScore, opponentScore);
              onClose();
            }}
          >게임 종료</Button>
          <Button
            className="cm-close-btn"
            onClick={onClose}
            style={{marginLeft:10, background:"#ececec", color:"#222"}}
          >닫기</Button>
        </div>
      </div>
    </div>
  );
};

// ======= 본문 =======
export default function CurrentMatchingGameRoom() {
  const { id: roomId } = useParams();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [headerTitle, setHeaderTitle] = useState('');
  const [courtName, setCourtName]   = useState('');
  const [courtAddr, setCourtAddr]   = useState(''); 
  const [gameRooms, setGameRooms] = useState([]);
  const [manualWaitlist, setManualWaitlist] = useState([]);
  const [autoWaitlist, setAutoWaitlist] = useState([]);
  const [selected, setSelected] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRoom, setModalRoom] = useState(null);
  const [modalTypeOpen, setModalTypeOpen] = useState(false);
  const { userId: currentUserId } = JSON.parse(
    localStorage.getItem('user') || '{}'
  );
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!roomId) return;

    axios
      .get('/api/game-room')
      .then(res => {
        const rooms = res.data?.data || res.data;
        const room  = rooms.find(r =>
          String(r.gameRoomId ?? r.id) === String(roomId)
        );

        if (room) {
          setHeaderTitle(room.title || '');
          setCourtName(room.location?.courtName || room.courtName || '');
          setCourtAddr(room.location?.courtAddress || room.courtAddress || '');
          setGameRooms(room.games ?? []);
          console.log('ROOM INFO', room);
          setIsAdmin(Number(room.createdBy?.userId) === Number(currentUserId));
        } else {
          setHeaderTitle('');
          setCourtName('');
          setCourtAddr('');
          setGameRooms([]);
          setIsAdmin(false);
        }
      })
      .catch(err => {
        console.error('ROOM INFO LOAD ERROR', err);
        setHeaderTitle('');
        setCourtName('');
        setCourtAddr('');
        setGameRooms([]);
      });
  }, [roomId]);

  // 방장만 내보내기
  const handleRemovePlayer = (roomId, playerId) => {
    setGameRooms(prev =>
      prev.map(room => {
        if (room.id === roomId && room.isMine) {
          const removed = room.players.find(p => p.id === playerId);
          if (removed) {
            if (removed.type === "manual") setManualWaitlist(prev => [...prev, removed]);
            else setAutoWaitlist(prev => [...prev, removed]);
          }
          return {
            ...room,
            players: room.players.filter(p => p.id !== playerId),
            status: "Waiting"
          };
        }
        return room;
      })
    );
  };

  const handleManualRegister = () => {
    const name = autoNames[Math.floor(Math.random() * autoNames.length)];
    const rankLevel = rankLevels[Math.floor(Math.random() * rankLevels.length)];
    setManualWaitlist(prev => [
      ...prev,
      { id: `${Date.now()}`, name, rankLevel, type: "manual" }
    ]);
  };

  const handleAutoRegister = () => setModalTypeOpen(true);

  const handleAddWaitlistByType = (gameType) => {
    const name = autoNames[Math.floor(Math.random() * autoNames.length)];
    const rankLevel = rankLevels[Math.floor(Math.random() * rankLevels.length)];
    setAutoWaitlist(prev => [
      ...prev,
      { id: `${Date.now()}`, name, rankLevel, gameType, type: "auto" }
    ]);
    setModalTypeOpen(false);
  };

  // 수동 매칭(체크박스 선택): 2명=단식, 4명=복식
  const handleManualMatchCreate = () => {
    if (selected.length !== 2 && selected.length !== 4) return;
    const gameType = selected.length === 2 ? "Singles" : "Doubles";
    const players = manualWaitlist.filter(p => selected.includes(p.id));
    const newPlayers = players.map(p => ({ ...p, gameType })); // 방 내에는 타입 부여
    setGameRooms(prev => [
      ...prev,
      {
        id: `manual-${Date.now()}`,
        courtName: "영남대학교 체육관",
        gameType,
        players: newPlayers,
        maxPlayers: gameType === "Singles" ? 2 : 4,
        status: "Ready",
        createdBy: "You",
        createdAt: new Date(),
        isMine: true
      }
    ]);
    setManualWaitlist(prev => prev.filter(p => !selected.includes(p.id)));
    setSelected([]);
  };

  const handleManualMatchCancel = () => setSelected([]);

  const handleStartAutoMatch = () => {
    ["Singles", "Doubles"].forEach(gameType => {
      const filtered = autoWaitlist.filter(p => p.gameType === gameType);
      const maxPlayers = gameType === "Singles" ? 2 : 4;
      if (filtered.length >= maxPlayers) {
        setGameRooms(prev => [
          ...prev,
          {
            id: `auto-${Date.now()}`,
            courtName: "영남대학교 체육관",
            gameType,
            players: filtered.slice(0, maxPlayers),
            maxPlayers,
            status: "Ready",
            createdBy: "자동매칭",
            createdAt: new Date(),
            isMine: false
          }
        ]);
        setAutoWaitlist(prev => prev.filter(p => !filtered.slice(0, maxPlayers).map(x => x.id).includes(p.id)));
      }
    });
  };

  const handleFinishGame = (myScore, opponentScore) => {
    alert(`게임이 종료되었습니다!\n내 팀: ${myScore}점\n상대 팀: ${opponentScore}점`);
  };

  const handleCreateRoom = () => {
    setGameRooms(prev => [
      ...prev,
      {
        id: `room${Date.now()}`,
        courtName: "영남대학교 체육관",
        gameType: "Doubles",
        players: [],
        maxPlayers: 4,
        status: "Waiting",
        createdBy: "You",
        createdAt: new Date(),
        isMine: true
      }
    ]);
  };

  const handleCancelRegister = () => {
    setManualWaitlist(prev => prev.length > 0 ? prev.slice(0, -1) : prev);
    setAutoWaitlist(prev => prev.length > 0 ? prev.slice(0, -1) : prev);
  };

  return (
    <div className="cm-current-matching-wrapper">
      <Header />
      <div className="cm-body-center">
        <div className="cm-current-matching-content">
          <div className="cm-court-matching-wrap">
            {/* 상단 정보 카드 */}
            <div className="cm-info-card">
              <div className="cm-info-row">
                <div>
                  <div className="cm-main-title">{headerTitle}</div>
                </div>
                <div className="cm-clock-box">
                  <Clock style={{ width: 18, height: 18, marginRight: 4 }} />
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
              <div className="cm-sub-row">
                <MapPin style={{ width: 16, height: 16, marginRight: 4 }} />
                <span className="cm-court-name">{courtName}</span>
                <Badge color="cm-black">매칭 가능</Badge>
              </div>
              <div className="cm-sub-address">{courtAddr}</div>
              <div className="cm-checkbox-row">
                <input
                  type="checkbox"
                  checked
                  disabled
                  id="auto-match"
                />
                <label htmlFor="auto-match" className="cm-auto-label">
                  자동 게임 생성 활성화
                </label>
              </div>
            </div>

            {/* 좌우 패널 */}
            <div className="cm-main-panel-grid">
              {/* 왼쪽: 게임방 목록 */}
              <div className="cm-game-rooms-card">
                <div className="cm-panel-header">
                  <Users style={{ width: 18, height: 18, marginRight: 5 }} />
                  <span>진행 중인 게임</span>
                  <Badge color="gray">{gameRooms.length}</Badge>
                  {isAdmin && (
                    <Button className="cm-create-btn" onClick={handleCreateRoom}>
                      <Plus style={{ width: 16, height: 16, marginRight: 5 }} />
                      게임방 생성
                    </Button>
                  )}
                </div>
                <div className="cm-panel-desc">기존 게임에 참가하거나 새 게임방을 만들 수 있습니다</div>
                {gameRooms.map(room => (
                  <div key={room.id} className="cm-game-room-box">
                    <div className="cm-room-header-row">
                      <div>
                        <Badge color="gray">{gameTypeLabel[room.gameType]}</Badge>
                        <Badge color={room.status === "Ready" ? "black" : "gray"}>
                          {room.status === "Ready" ? "매칭 완료" : "대기 중"}
                        </Badge>
                      </div>
                      <span className="cm-room-player-count">
                        {room.players.length}/{room.maxPlayers} 명
                      </span>
                    </div>
                    <div className="cm-players-list">
                      {room.players.map(player => (
                        <div key={player.id} className="cm-player-row">
                          <div className="cm-avatar">{player.name.split(" ").map(n => n[0]).join("")}</div>
                          <span className="cm-player-name">{player.name}</span>
                          <Badge color={rankColor[player.rankLevel]}>
                            {player.rankLevel}
                          </Badge>
                          {room.isMine && (
                            <Button className="cm-remove-btn" onClick={() => handleRemovePlayer(room.id, player.id)}>
                              내보내기
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button className="cm-join-btn"
                        onClick={() => {
                          setModalRoom(room);
                          setModalOpen(true);
                        }}>
                        <UserPlus style={{ width: 14, height: 14, marginRight: 4 }} />
                        조회
                      </Button>
                    </div>
                    <div className="cm-room-created-at">
                      {room.createdBy} 님이 생성 · {room.createdAt.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* 오른쪽: 대기자 명단 */}
              <div className="cm-waitlist-card">
                {/* 수동 대기자 명단(위) */}
                <div>
                  <div className="cm-panel-header" style={{ alignItems: "center", gap: 12 }}>
                    <Users style={{ width: 18, height: 18, marginRight: 5 }} />
                    <span>수동 대기자 명단</span>
                    <Badge color="gray">{manualWaitlist.length}</Badge>
                    <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
                      <Button className="cm-create-btn" onClick={handleManualRegister}>수동 매칭 등록</Button>
                    </div>
                  </div>
                  <div className="cm-panel-desc">체크 후 선택 인원(2명=단식, 4명=복식)으로 방을 직접 만들 수 있습니다</div>
                  <div className="cm-waitlist-list">
                    {manualWaitlist.map(player => (
                      <div className="cm-waitlist-row" key={player.id}>
                        <input
                          type="checkbox"
                          checked={selected.includes(player.id)}
                          onChange={() =>
                            setSelected(selected.includes(player.id)
                              ? selected.filter(id => id !== player.id)
                              : [...selected, player.id])
                          }
                          style={{ marginRight: 8 }}
                        />
                        <div className="cm-wait-avatar">{player.name.split(" ").map(n => n[0]).join("")}</div>
                        <span className="cm-wait-name">{player.name}</span>
                        <Badge color={rankColor[player.rankLevel]}>
                          {player.rankLevel}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 14 }}>
                    {isAdmin && (
                      <>
                        <Button
                          onClick={handleManualMatchCreate}
                          disabled={selected.length !== 2 && selected.length !== 4}
                          style={{
                            marginRight: 8,
                            background: '#e8e3fd',
                            color: '#6930c3',
                            borderRadius: 6
                          }}
                        >
                          게임 매칭
                        </Button>
                        <Button
                          onClick={handleManualMatchCancel}
                          style={{
                            background: '#ececec',
                            color: '#555',
                            borderRadius: 6
                          }}
                        >
                          취소
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <hr style={{ margin: "28px 0" }} />
                {/* 자동 대기자 명단(아래) */}
                <div>
                  <div className="cm-panel-header" style={{ alignItems: "center", gap: 12 }}>
                    <Users style={{ width: 18, height: 18, marginRight: 5 }} />
                    <span>자동 대기자 명단</span>
                    <Badge color="gray">{autoWaitlist.length}</Badge>
                    <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
                      <Button className="cm-create-btn" onClick={handleAutoRegister}>자동 매칭 등록</Button>
                    </div>
                  </div>
                  <div className="cm-panel-desc">아래 명단은 자동으로 방이 생성됩니다</div>
                  <div className="cm-waitlist-list">
                    {autoWaitlist.map(player => (
                      <div className="cm-waitlist-row" key={player.id}>
                        <div className="cm-wait-avatar">{player.name.split(" ").map(n => n[0]).join("")}</div>
                        <span className="cm-wait-name">{player.name}</span>
                        <Badge color={rankColor[player.rankLevel]}>
                          {player.rankLevel}
                        </Badge>
                        <span style={{ marginLeft: 8, fontSize: 13, color: "#333" }}>
                          {gameTypeLabel[player.gameType]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    marginTop: 14, display: "flex", justifyContent: "center"
                  }}>
                    {isAdmin && (
                      <button
                        className="cm-create-btn"
                        onClick={handleStartAutoMatch}
                      >
                        자동 매칭 시작
                      </button>
                    )}
                  </div>
                </div>
                {isAdmin && (
                <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
                  <Button className="cm-create-btn" onClick={handleCancelRegister}>매칭 등록 취소</Button>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* ======== 모달들 ======== */}
        <SelectTypeModal
          open={modalTypeOpen}
          onClose={() => setModalTypeOpen(false)}
          onSelect={handleAddWaitlistByType}
        />
        <GameResultModal
          visible={modalOpen}
          room={modalRoom}
          onClose={() => setModalOpen(false)}
          onFinishGame={handleFinishGame}
        />
      </div>
      <Footer />
    </div>
  );
}
