import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

const RaffleContent = () => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0'}}>
    <img src="https://via.placeholder.com/672x672" alt="Raffle Product" style={{width: 672, height: 672}} />
    <div style={{width: 1024, textAlign: 'center', marginTop: 40}}>
      <h1 style={{fontSize: 48, fontWeight: 700, color: '#1F2937', marginBottom: 20}}>딜리셔스 인 던전 키체인 골드</h1>
      <p style={{fontSize: 15, color: '#374151', marginBottom: 10}}>
        응모상품은 APP에서 진행이 가능합니다. 아래 버튼을 눌러 앱을 다운 받아주세요.
      </p>
      <p style={{fontSize: 14, color: '#9CA3AF', marginBottom: 20}}>
        * 해당 제품은 이해를 돕기 위한 제품이며, 현재 응모 예정이거나 마감되었을 수 있습니다.
      </p>
      <button style={{
        width: 192,
        height: 40,
        borderRadius: 8,
        border: '1px solid #374151',
        background: 'white',
        color: '#1F2937',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer'
      }}>
        응모 바로 가기
      </button>
    </div>
  </div>
);

const FloatingButton = () => (
  <button style={{
    position: 'fixed',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'black',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.22)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <div style={{
      width: 32,
      height: 3,
      background: 'white',
      borderRadius: 144,
      position: 'absolute',
      top: '40%'
    }} />
    <div style={{
      width: 32,
      height: 3,
      background: 'white',
      borderRadius: 144,
      position: 'absolute',
      bottom: '40%'
    }} />
    <div style={{
      position: 'absolute',
      top: -4,
      right: -4,
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: '#FE0000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontSize: 13,
      fontWeight: 700
    }}>
      N
    </div>
  </button>
);

const Raffles = () => {
  return (
    <div className="RafflesPage" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      <Header />
      <main style={{flex: 1}}>
        <RaffleContent />
      </main>
      <Footer />
      <FloatingButton />
    </div>
  );
};

export default Raffles;