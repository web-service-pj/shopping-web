import React, { useEffect }  from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { checkTokenExpiration } from './utils/auth';
import MainPage from './pages/MainPage';
import Notifications from './pages/NotificationsPage'; 
import Stores from './pages/StoresPage'
import Login from './pages/LoginPage'
import SignUp from './pages/SignUpPage'
import Men from './pages/MenPage'
import Women from './pages/WomenPage'
import Brand from './pages/BrandPage'
import BrandProductPage from './pages/BrandProductPage';
import ProductDetailPage from './pages/ProductDetailPage';
import MyPage from './pages/MyPage';
import KakaoCallback from './pages/KakaoCallback';

function App() {
  useEffect(() => {
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000); // 1분마다 체크
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/men" element={<Men />} />
        <Route path="/men/:productCode" element={<ProductDetailPage />} />
        <Route path="/women" element={<Women />} />
        <Route path="/women/:productName" element={<ProductDetailPage gender="women" />} /> 
        <Route path="/brands" element={<Brand />} />
        <Route path="/brands/:brandName/products" element={<BrandProductPage />} />
        <Route path="/brands/:brandName/:productCode" element={<ProductDetailPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />
      </Routes>
    </Router>
  );
}

export default App;