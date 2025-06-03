import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/CurrentMatching.css';
import { MapPin, Clock, Users, UserPlus, Plus, Settings } from "lucide-react";

// 배지 컴포넌트
const Badge = ({ children, color = "gray" }) => (
  <span className={`badge badge-${color}`}>{children}</span>
);

// 버튼 컴포넌트
const Button = ({ children, ...props }) => (
  <button className="btn" {...props}>{children}</button>
);

// 실력 색상 매핑
const skillColor = {
  Beginner: "green",
  Intermediate: "yellow",
  Advanced: "red"
};

export default function CourtMatching() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedGameType, setSelectedGameType] = useState("Doubles");
  const [gameRooms, setGameRooms] = useState([
    {
      id: "room1",
      courtName: "영남대학교 체육관",
      gameType: "Doubles",
      players: [
        { id: "p1", name: "John Doe", skillLevel: "Advanced" },
        { id: "p2", name: "Jane Smith", skillLevel: "Intermediate" },
      ],
      maxPlayers: 4,
      status: "Waiting",
      createdBy: "John Doe",
      createdAt: new Date(Date.now() - 300000),
    },
  ]);
  const [waitlist, setWaitlist] = useState([
    { id: "5", name: "David Kim", skillLevel: "Intermediate", waitTime: 3 },
    { id: "6", name: "Lisa Zhang", skillLevel: "Advanced", waitTime: 20 },
  ]);
  const [autoMatchEnabled, setAutoMatchEnabled] = useState(true);
  const [manualMatchOpen, setManualMatchOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCreateRoom = () => {
    const newRoom = {
      id: `room${Date.now()}`,
      courtName: "영남대학교 체육관",
      gameType: selectedGameType,
      players: [],
      maxPlayers: selectedGameType === "Singles" ? 2 : 4,
      status: "Waiting",
      createdBy: "You",
      createdAt: new Date(),
    };
    setGameRooms(prev => [...prev, newRoom]);
  };

  const handleJoinRoom = (roomId) => {
    if (waitlist.length === 0) return;
    setGameRooms(prev =>
      prev.map(room => {
        if (room.id === roomId && room.players.length < room.maxPlayers) {
          const player = waitlist[0];
          const updatedPlayers = [...room.players, player];
          return {
            ...room,
            players: updatedPlayers,
            status: updatedPlayers.length === room.maxPlayers ? "Ready" : "Waiting",
          };
        }
        return room;
      })
    );
    setWaitlist(prev => prev.slice(1));
  };

  const handleRemovePlayer = (roomId, playerId) => {
    let removedPlayer = null;
    setGameRooms(prev =>
      prev.map(room => {
        if (room.id === roomId) {
          removedPlayer = room.players.find(p => p.id === playerId);
          return {
            ...room,
            players: room.players.filter(p => p.id !== playerId),
            status: "Waiting",
          };
        }
        return room;
      })
    );
    if (removedPlayer) {
      setWaitlist(prev => [...prev, removedPlayer]);
    }
  };

  const handleWaitlistJoin = (playerId, gameType) => {
    const targetRoom = gameRooms.find(
      room =>
        room.gameType === gameType &&
        room.status === "Waiting" &&
        room.players.length < room.maxPlayers
    );
    if (!targetRoom) return;
    const player = waitlist.find(p => p.id === playerId);
    if (!player) return;
    setGameRooms(prev =>
      prev.map(room =>
        room.id === targetRoom.id
          ? {
              ...room,
              players: [...room.players, player],
              status: room.players.length + 1 === room.maxPlayers ? "Ready" : "Waiting",
            }
          : room
      )
    );
    setWaitlist(prev => prev.filter(p => p.id !== playerId));
  };

  const handleManualMatchCreate = () => {
    if (selected.length < 2) return alert('최소 2명을 선택하세요!');
    const gameType = selected.length === 2 ? "Singles" : "Doubles";
    const players = waitlist.filter(p => selected.includes(p.id));
    const newRoom = {
      id: `manual-${Date.now()}`,
      courtName: "영남대학교 체육관",
      gameType,
      players,
      maxPlayers: gameType === "Singles" ? 2 : 4,
      status: players.length === (gameType === "Singles" ? 2 : 4) ? "Ready" : "Waiting",
      createdBy: "You",
      createdAt: new Date(),
    };
    setGameRooms(prev => [...prev, newRoom]);
    setWaitlist(prev => prev.filter(p => !selected.includes(p.id)));
    setSelected([]);
    setManualMatchOpen(false);
  };

  return (
    <div className="current-matching-wrapper">
      <Header />

      <div className="current-matching-content">
        <div className="court-matching-wrap">
          {/* 상단 정보 카드 */}
          <div className="info-card">
            <div className="info-row">
              <div>
                <div className="main-title">현장 매칭 모드</div>
                <div className="info-desc">현재 위치에서 게임방을 생성하거나 참가하세요</div>
              </div>
              <div className="clock-box">
                <Clock style={{ width: 18, height: 18, marginRight: 4 }} />
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
            <div className="sub-row">
              <MapPin style={{ width: 16, height: 16, marginRight: 4 }} />
              <span className="court-name">영남대학교 체육관</span>
              <Badge color="black">매칭 가능</Badge>
            </div>
            <div className="sub-address">123 River St, Downtown</div>
            <div className="checkbox-row">
              <input
                type="checkbox"
                checked={autoMatchEnabled}
                onChange={e => setAutoMatchEnabled(e.target.checked)}
                id="auto-match"
              />
              <label htmlFor="auto-match" className="auto-label">
                자동 게임 생성 활성화
              </label>
            </div>
          </div>

          {/* 좌우 패널 */}
          <div className="main-panel-grid">
            {/* 왼쪽: 게임방 목록 */}
            <div className="game-rooms-card">
              <div className="panel-header">
                <Users style={{ width: 18, height: 18, marginRight: 5 }} />
                <span>진행 중인 게임방</span>
                <Badge color="gray">{gameRooms.length}</Badge>
                <Button className="create-btn" onClick={handleCreateRoom}>
                  <Plus style={{ width: 16, height: 16, marginRight: 5 }} />
                  게임방 생성
                </Button>
              </div>
              <div className="panel-desc">기존 게임에 참가하거나 새 게임방을 만들 수 있습니다</div>
              {gameRooms.map(room => (
                <div key={room.id} className="game-room-box">
                  <div className="room-header-row">
                    <div>
                      <Badge color="gray">{room.gameType === "Doubles" ? "복식" : "단식"}</Badge>
                      <Badge color={room.status === "Ready" ? "black" : "gray"}>
                        {room.status === "Ready" ? "매칭 완료" : "대기 중"}
                      </Badge>
                    </div>
                    <span className="room-player-count">
                      {room.players.length}/{room.maxPlayers} 명
                    </span>
                  </div>
                  <div className="players-list">
                    {room.players.map(player => (
                      <div key={player.id} className="player-row">
                        <div className="avatar">{player.name.split(" ").map(n => n[0]).join("")}</div>
                        <span className="player-name">{player.name}</span>
                        <Badge color={skillColor[player.skillLevel]}>
                          {player.skillLevel === "Beginner"
                            ? "초급"
                            : player.skillLevel === "Intermediate"
                            ? "중급"
                            : "고급"}
                        </Badge>
                        <Button className="remove-btn" onClick={() => handleRemovePlayer(room.id, player.id)}>
                          내보내기
                        </Button>
                      </div>
                    ))}
                    {room.players.length < room.maxPlayers && waitlist.length > 0 && (
                      <Button className="join-btn" onClick={() => handleJoinRoom(room.id)}>
                        <UserPlus style={{ width: 14, height: 14, marginRight: 4 }} />
                        입장
                      </Button>
                    )}
                  </div>
                  <div className="room-created-at">
                    {room.createdBy} 님이 생성 · {room.createdAt.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>

            {/* 오른쪽: 대기열 */}
            <div className="waitlist-card">
              <div className="panel-header">
                <Users style={{ width: 18, height: 18, marginRight: 5 }} />
                <span>대기자 명단</span>
                <Badge color="gray">{waitlist.length}</Badge>
                <Button className="manual-btn" onClick={() => setManualMatchOpen(true)}>
                  <Settings style={{ width: 16, height: 16, marginRight: 5 }} />
                  수동 매칭
                </Button>
              </div>
              <div className="panel-desc">해당 구장에서 참가를 기다리는 대기자 명단입니다</div>
              <div className="waitlist-list">
                {waitlist.map(player => (
                  <div className="waitlist-row" key={player.id}>
                    <div className="wait-avatar">{player.name.split(" ").map(n => n[0]).join("")}</div>
                    <span className="wait-name">{player.name}</span>
                    <Badge color={skillColor[player.skillLevel]}>
                      {player.skillLevel === "Beginner"
                        ? "초급"
                        : player.skillLevel === "Intermediate"
                        ? "중급"
                        : "고급"}
                    </Badge>
                    <span className="wait-time">{player.waitTime}분 대기 중</span>
                    <Button className="wait-join-btn" onClick={() => handleWaitlistJoin(player.id, "Doubles")}>
                      복식 입장
                    </Button>
                    <Button className="wait-join-btn" onClick={() => handleWaitlistJoin(player.id, "Singles")}>
                      단식 입장
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 수동 매칭 모달 */}
          {manualMatchOpen && (
            <div className="modal">
              <h3 style={{ marginBottom: '18px' }}>수동 매칭할 대기자 선택</h3>
              {waitlist.length === 0 ? (
                <div style={{ marginBottom: 16, color: "#aaa" }}>대기자가 없습니다.</div>
              ) : (
                waitlist.map((w) => (
                  <label key={w.id} style={{ display: 'block', marginBottom: 6, fontSize: 15 }}>
                    <input
                      type="checkbox"
                      checked={selected.includes(w.id)}
                      onChange={() =>
                        setSelected(selected.includes(w.id)
                          ? selected.filter(id => id !== w.id)
                          : [...selected, w.id])
                      }
                      style={{ marginRight: 6 }}
                    />
                    {w.name}
                  </label>
                ))
              )}
              <div style={{ marginTop: 16 }}>
                <button
                  onClick={handleManualMatchCreate}
                  disabled={selected.length < 2}
                  style={{
                    marginRight: 8, background: '#e8e3fd', borderRadius: 6,
                    fontWeight: 'bold', padding: '6px 18px', border: 'none', color: '#413c5a'
                  }}
                >방 생성</button>
                <button
                  onClick={() => { setManualMatchOpen(false); setSelected([]); }}
                  style={{
                    background: '#ececec', borderRadius: 6,
                    fontWeight: 'bold', padding: '6px 18px', border: 'none', color: '#555'
                  }}
                >취소</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
