import React from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/footer';

const NotificationContent = () => (
  <div style={{padding: '40px 80px'}}>
    <h1 style={{textAlign: 'center', fontSize: 15, fontWeight: 700, marginBottom: 20}}>알림센터</h1>
    <div style={{display: 'flex', justifyContent: 'center', marginBottom: 20}}>
      <button style={{padding: '6px 16px', borderBottom: '2px solid black', fontSize: 12, fontWeight: 500}}>공지</button>
    </div>
    <table style={{width: '100%', borderCollapse: 'collapse'}}>
      <thead style={{background: '#F9FAFB'}}>
        <tr>
          <th style={{padding: '12px 0', color: '#6B7280', fontSize: 12, textTransform: 'uppercase'}}>순번</th>
          <th style={{padding: '12px 0', color: '#6B7280', fontSize: 12, textTransform: 'uppercase'}}>제목</th>
          <th style={{padding: '12px 0', color: '#6B7280', fontSize: 12, textTransform: 'uppercase'}}>등록일</th>
        </tr>
      </thead>
      <tbody>
        <tr style={{borderTop: '1px solid #E5E7EB'}}>
          <td style={{padding: '16px 0', textAlign: 'center', color: '#6B7280', fontSize: 12}}>1</td>
          <td style={{padding: '16px 0', textAlign: 'center', color: '#6B7280', fontSize: 12}}>추석 배송 공지 및 오프라인 스토어 운영 안내</td>
          <td style={{padding: '16px 0', textAlign: 'center', color: '#6B7280', fontSize: 11.25}}>2024.09.09</td>
        </tr>
        <tr style={{borderTop: '1px solid #E5E7EB'}}>
          <td style={{padding: '16px 0', textAlign: 'center', color: '#6B7280', fontSize: 12}}>2</td>
          <td style={{padding: '16px 0', textAlign: 'center', color: '#6B7280', fontSize: 12}}>온라인 스토어 교환 서비스 중단 안내</td>
          <td style={{padding: '16px 0', textAlign: 'center', color: '#6B7280', fontSize: 11.62}}>2024.07.26</td>
        </tr>
      </tbody>
    </table>
    <div style={{display: 'flex', justifyContent: 'center', marginTop: 32}}>
      <button style={{padding: '9px 25px', border: '1px solid #D1D5DB', fontSize: 12, display: 'flex', alignItems: 'center', gap: '4px'}}>
        더 보기
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6L8 10L12 6" stroke="#1F2937" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
);

const Notification = () => {
  return (
    <div className="NotificationPage" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      <Header />
      <main style={{flex: 1}}>
        <NotificationContent />
      </main>
      <Footer />
    </div>
  );
};

export default Notification;