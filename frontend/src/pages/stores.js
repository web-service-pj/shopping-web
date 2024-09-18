import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

const StoreList = () => (
  <div style={{width: 384, height: '100%', overflowY: 'auto', borderRight: '1px solid #F3F4F6'}}>
    <div style={{background: '#2F312F', color: 'white', padding: '15px 10px', fontSize: 14, fontWeight: 200}}>
      웍스아웃 스토어
    </div>
    {['서울 압구정', '서울 홍대 라이즈', '부산 신세계백화점 센텀시티'].map((store, index) => (
      <div key={index} style={{padding: '7px 10px', borderBottom: '1px solid #F7F7F7', fontSize: 14}}>
        {store}
      </div>
    ))}
    {/* 여기에 다른 브랜드 스토어 목록을 추가할 수 있습니다 */}
  </div>
);

const MapView = () => (
  <div style={{flex: 1, position: 'relative'}}>
    <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 59, background: '#2E312F', color: 'white', padding: '15px 20px', display: 'flex', alignItems: 'center'}}>
      <span style={{fontSize: 16, fontWeight: 500}}>WORKSOUT</span>
    </div>
    <div style={{height: '100%', background: '#E5E3DF'}}>
      {/* 여기에 실제 지도를 구현해야 합니다. 예를 들어 Google Maps API를 사용할 수 있습니다. */}
      <div style={{padding: 20, color: '#333'}}>지도가 여기에 표시됩니다.</div>
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

const Stores = () => {
  return (
    <div className="StoresPage" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      <Header />
      <main style={{flex: 1, display: 'flex'}}>
        <StoreList />
        <MapView />
      </main>
      <Footer />
      <FloatingButton />
    </div>
  );
};

export default Stores;