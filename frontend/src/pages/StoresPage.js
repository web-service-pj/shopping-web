import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/footer';

const StoreList = ({ stores, onStoreSelect }) => (
  <div style={{width: 384, height: '100%', overflowY: 'auto', borderRight: '1px solid #F3F4F6'}}>
    <div style={{background: '#2F312F', color: 'white', padding: '15px 10px', fontSize: 14, fontWeight: 200}}>
      TRENDCORE STORE
    </div>
    {stores.map((store, index) => (
      <div key={index} 
           onClick={() => onStoreSelect(store)}
           style={{padding: '7px 10px', borderBottom: '1px solid #F7F7F7', fontSize: 14, cursor: 'pointer'}}>
        {store.name}
      </div>
    ))}
  </div>
);

const MapView = ({ stores, selectedStore }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=b25ecc2847ebb47f630ff4d3acf6444b&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const options = {
          center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
          level: 3
        };
        const map = new window.kakao.maps.Map(mapRef.current, options);
        mapInstanceRef.current = map;

        stores.forEach(store => {
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(store.lat, store.lng),
            map: map
          });

          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;">${store.name}</div>`
          });

          window.kakao.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map, marker);
          });
        });
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [stores]);

  useEffect(() => {
    if (selectedStore && mapInstanceRef.current) {
      const moveLatLon = new window.kakao.maps.LatLng(selectedStore.lat, selectedStore.lng);
      mapInstanceRef.current.panTo(moveLatLon);
    }
  }, [selectedStore]);

  return (
    <div style={{flex: 1, position: 'relative'}}>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 59, background: '#2E312F', color: 'white', padding: '15px 20px', display: 'flex', alignItems: 'center'}}>
        <span style={{fontSize: 16, fontWeight: 500}}>TREND CORE</span>
      </div>
      <div ref={mapRef} style={{height: '100%'}}></div>
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

const Stores = () => {
  const [stores] = useState([
    { name: '서울 압구정', lat: 37.527114, lng: 127.028484 },
    { name: '서울 홍대 라이즈', lat: 37.556281, lng: 126.923710 },
    { name: '부산 신세계백화점 센텀시티', lat: 35.168852, lng: 129.131281 },
    { name: '서울 잠실 롯데타워', lat: 37.5126, lng: 127.1026 },
    { name: '서울 성수동', lat: 37.5445, lng: 127.0567 }
  ]);
  const [selectedStore, setSelectedStore] = useState(null);

  return (
    <div className="StoresPage" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      <Header />
      <main style={{flex: 1, display: 'flex'}}>
        <StoreList stores={stores} onStoreSelect={setSelectedStore} />
        <MapView stores={stores} selectedStore={selectedStore} />
      </main>
      <Footer />
      <FloatingButton />
    </div>
  );
};

export default Stores;