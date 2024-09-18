import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

const EditorialGrid = () => {
  const editorials = [
    { title: '져지 제품 에디토리얼', date: '2024.09.13', image: 'Vevct7d99fed.jpg' },
    { title: '러닝 슈즈 스타일링 에디토리얼', date: '2024.09.05', image: 'Hrs17yf5kh80.jpg' },
    { title: '언제나 완벽한 블랙 아이템', date: '2024.08.27', image: 'Vbkplnuuvi3l.jpg' },
    { title: '여름 바캉스 스타일링', date: '2024.07.31', image: 'Uvhgngif93ck.jpg' },
    { title: '나이키 섬머 슈즈 컬렉션', date: '2024.07.30', image: 'S1h5tbly2a7t.jpg' },
    { title: '마샬과 함께한 새로운 교감', date: '2024.07.19', image: 'Ib3op9utp6jo.jpg' },
    { title: '웍스아웃 숏 슬리브 에디토리얼', date: '2024.07.22', image: 'Iemoee8xs114.jpg' },
    { title: '데우스 엑스 마키나 24 섬머 에디토리얼', date: '2024.06.28', image: 'Jecmjoc8g20n.jpg' },
    // ... 더 많은 에디토리얼 항목들
  ];

  return (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', padding: '20px'}}>
      {editorials.map((editorial, index) => (
        <div key={index} className="Container" style={{width: '100%', aspectRatio: '463/601.89'}}>
          <img 
            src={`/images/${editorial.image}`} 
            alt={editorial.title} 
            style={{width: '100%', height: '279.38px', objectFit: 'cover'}}
          />
          <div style={{marginTop: '12px'}}>
            <h3 style={{color: '#1F2937', fontSize: 14, fontFamily: 'Work Sans', fontWeight: '600', marginBottom: '4px'}}>{editorial.title}</h3>
            <p style={{color: '#1F2937', fontSize: 10.66, fontFamily: 'Work Sans', fontWeight: '600'}}>{editorial.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

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

const Editorial = () => {
  return (
    <div className="EditorialPage" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      <Header />
      <main style={{flex: 1}}>
        <EditorialGrid />
      </main>
      <Footer />
      <FloatingButton />
    </div>
  );
};

export default Editorial;