import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Notifications from './pages/NotificationsPage'; 
import Stores from './pages/StoresPage'
import Login from './pages/LoginPage'
import SignUp from './pages/SignUpPage'
import Men from './pages/MenPage'
import Women from './pages/WomenPage'
import Brand from './pages/BrandPage'
import BrandProductPage from './pages/BrandProductPage';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/brands" element={<Brand />} />
        <Route path="/brands/:brandName/products" element={<BrandProductPage />} />
      </Routes>
    </Router>
  );
}

export default App;