import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split('/')[1];
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      setIsLoggedIn(true);
      setUserName(user.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/');
  };

  const isActive = (path) => currentPath === path;

  return (
    <header>
      <nav className="Background" style={{width: '100%', height: 98, background: 'rgba(255, 255, 255, 0.95)'}}>
        <div className="Horizontalborder" style={{height: 61, borderBottom: '1px #F3F4F6 solid', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px'}}>
          <div style={{display: 'flex', gap: '24px'}}>
            <Link to="/notifications" style={{color: '#1F2937', fontSize: 12}}>알림센터</Link>
            <Link to="/stores" style={{color: '#1F2937', fontSize: 12}}>매장 정보</Link>
          </div>
          <Link to="/" style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}>
            <img src="/logo.png" alt="Trend Core" style={{height: '50px'}} />
          </Link>
          <div style={{display: 'flex', gap: '24px', alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 11L8.5 8.5M10 5.5C10 7.98528 7.98528 10 5.5 10C3.01472 10 1 7.98528 1 5.5C1 3.01472 3.01472 1 5.5 1C7.98528 1 10 3.01472 10 5.5Z" stroke="#1F2937" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{color: '#1F2937', fontSize: 12}}>검색</span>
            </div>
            <Link to="/cart" style={{color: '#1F2937', fontSize: 12}}>장바구니</Link>
            {isLoggedIn ? (
              <>
                <span style={{color: '#1F2937', fontSize: 12}}>{userName}님</span>
                <button onClick={handleLogout} style={{color: '#1F2937', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer'}}>마이페이지</button>
              </>
            ) : (
              <Link to="/login" style={{color: '#1F2937', fontSize: 12}}>로그인</Link>
            )}
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', gap: '48px', height: 36, alignItems: 'center'}}>
          <Link 
            to="/men" 
            style={{
              color: isActive('men') ? '#1F2937' : '#4B5563',
              fontSize: 12,
              fontWeight: isActive('men') ? 'bold' : 'normal'
            }}
          >
            남성
          </Link>
          <Link 
            to="/women" 
            style={{
              color: isActive('women') ? '#1F2937' : '#4B5563',
              fontSize: 12,
              fontWeight: isActive('women') ? 'bold' : 'normal'
            }}
          >
            여성
          </Link>
          <Link 
            to="/brands" 
            style={{
              color: isActive('brands') ? '#1F2937' : '#4B5563',
              fontSize: 12,
              fontWeight: isActive('brands') ? 'bold' : 'normal'
            }}
          >
            브랜드
          </Link>
          <Link 
            to="/sale" 
            style={{
              color: isActive('sale') ? '#DC2626' : '#DC2626',
              fontSize: 12,
              fontWeight: isActive('sale') ? 'bold' : 600
            }}
          >
            세일
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;