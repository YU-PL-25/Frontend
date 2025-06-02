import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/MatchHistory.css';

function MatchHistory() {
  const { isAuthenticated } = useSelector(state => state.auth);

  const dummyHistory = [
    { id: 1, type: '단식', date: '2025-05-28', opponent: '김철수', result: '승', score: '21-18', location: '경산체육관' },
    { id: 2, type: '단식', date: '2025-05-21', opponent: '이영희', result: '패', score: '19-21', location: '대구배드민턴장' },
    { id: 3, type: '복식', date: '2025-05-14', opponent: '박민수, 윤서현', result: '승', score: '21-12', location: '경북체육관' },
    { id: 4, type: '복식', date: '2025-05-07', opponent: '최수진, 이재호', result: '승', score: '21-16', location: '영남대학교 체육관' },
    { id: 5, type: '단식', date: '2025-04-30', opponent: '정우성', result: '패', score: '18-21', location: '경산실내체육관' },
    { id: 6, type: '단식', date: '2025-04-23', opponent: '홍길동', result: '승', score: '21-10', location: '대구국제배드민턴장' },
    { id: 7, type: '단식', date: '2025-04-16', opponent: '박영수', result: '패', score: '19-21', location: '경산선수촌' },
    { id: 8, type: '복식', date: '2025-04-09', opponent: '최수민, 김민지', result: '패', score: '18-21', location: '대구배드민턴센터' },
    { id: 9, type: '단식', date: '2025-04-02', opponent: '이소라', result: '승', score: '21-13', location: '영남대학교 체육관' },
    { id: 10, type: '단식', date: '2025-03-26', opponent: '김민재', result: '승', score: '21-17', location: '경북체육관' },
    { id: 11, type: '복식', date: '2025-03-19', opponent: '이현수, 박지영', result: '승', score: '21-15', location: '경산체육관' },
    { id: 12, type: '단식', date: '2025-03-12', opponent: '정민호', result: '패', score: '20-22', location: '대구배드민턴장' },
    { id: 13, type: '복식', date: '2025-03-05', opponent: '최영희, 김철수', result: '승', score: '21-14', location: '경산실내체육관' },
    { id: 14, type: '단식', date: '2025-02-26', opponent: '이준호', result: '승', score: '21-19', location: '영남대학교 체육관' },
    { id: 15, type: '단식', date: '2025-02-19', opponent: '박지훈', result: '패', score: '18-21', location: '대구국제배드민턴장' },
    { id: 16, type: '복식', date: '2025-02-12', opponent: '김영희, 이수진', result: '승', score: '21-11', location: '경북체육관' },
    { id: 17, type: '단식', date: '2025-02-05', opponent: '홍길동', result: '승', score: '21-16', location: '경산선수촌' },
    { id: 18, type: '단식', date: '2025-01-29', opponent: '이정민', result: '패', score: '19-21', location: '대구배드민턴센터' },
    { id: 19, type: '복식', date: '2025-01-22', opponent: '최수영, 김민지', result: '승', score: '21-15', location: '경산체육관' },
    { id: 20, type: '단식', date: '2025-01-15', opponent: '박영수', result: '패', score: '20-22', location: '영남대학교 체육관' }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalItems = dummyHistory.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentData = dummyHistory.slice(startIdx, endIdx);

  const goToPage = pageNum => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace/>;
  }

  return (
    <div className="mh-page-wrapper">
      <Header/>

      <div className="mh-page-content">
        <div className="mh-container">
          <h2 className="mh-title">경기 내역 조회</h2>
          <div className="mh-table-wrapper">
            <table className="mh-table">
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>종류</th>
                  <th>상대</th>
                  <th>결과</th>
                  <th>점수</th>
                  <th>위치</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map(match => (
                  <tr key={match.id}>
                    <td>{match.date}</td>
                    <td>{match.type}</td>
                    <td>{match.opponent}</td>
                    <td className={match.result === '승' ? 'result-win' : 'result-loss'}>{match.result}</td>
                    <td>{match.score}</td>
                    <td>{match.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mh-pagination">
            <button className="page-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              이전
            </button>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button key={idx + 1} className={`page-btn ${currentPage === idx + 1 ? 'active' : ''}`} onClick={() => goToPage(idx + 1)}>
                {idx + 1}
              </button>
            ))}
            <button className="page-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
              다음
            </button>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}

export default MatchHistory;
