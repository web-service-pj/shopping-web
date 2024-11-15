import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [isFooterVisible, setIsFooterVisible] = useState(true);

  const toggleFooterVisibility = () => {
    setIsFooterVisible((prevState) => !prevState);
  };

  return (
    <footer
      style={{
        borderTop: '1px solid #F3F4F6',
        padding: '20px',
        fontSize: 12,
        color: '#888888',
        transform: isFooterVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <div>
          <Link to="/about" style={{ color: '#1F2937', marginRight: '20px' }}>
            트렌드코어에 대하여
          </Link>
          <Link to="/support" style={{ color: '#1F2937', marginRight: '20px' }}>
            고객지원
          </Link>
          <Link to="/contact" style={{ color: '#1F2937', marginRight: '20px' }}>
            문의하기
          </Link>
        </div>
        <div>
          <button
            onClick={toggleFooterVisibility}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 3L6 8L11 3"
                stroke="#333D4B"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      {isFooterVisible && (
        <>
          <div style={{ marginBottom: '10px' }}>
            © 2003-2024 주식회사 트렌드코어 | 통신판매업신고: 2024-전북전주-0219 | 호스팅사업자: 전북대학교 JCloud | 사업자등록번호: 102-3234-52123
          </div>
          <div style={{ marginBottom: '10px' }}>
            상호명: 주식회사 트렌드코어 | 주소: 전주시 덕진구 백제대로 567 공과대학 7호관 | 전자우편주소: customer@trendcore.co.kr | 대표: 노형준, 이진규 | 전화: 063-270-1234
          </div>
          <div>
            <Link to="/terms" style={{ marginRight: '20px' }}>
              이용약관
            </Link>
            <Link to="/privacy" style={{ marginRight: '20px' }}>
              개인정보취급 방침
            </Link>
            <Link to="/escrow" style={{ color: '#1F2937' }}>
              구매안전 (에스크로) 서비스 가입사실 확인
            </Link>
          </div>
        </>
      )}
      {!isFooterVisible && (
        <button
          onClick={toggleFooterVisibility}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#1F2937',
          }}
        >
          open
        </button>
      )}
    </footer>
  );
};

export default Footer;