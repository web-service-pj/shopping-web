import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{borderTop: '1px solid #F3F4F6', padding: '20px', fontSize: 12, color: '#888888'}}>
    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
      <div>
        <Link to="/about" style={{color: '#1F2937', marginRight: '20px'}}>웍스아웃에 대하여</Link>
        <Link to="/support" style={{color: '#1F2937', marginRight: '20px'}}>고객지원</Link>
        <Link to="/contact" style={{color: '#1F2937', marginRight: '20px'}}>문의하기</Link>
        <Link to="/careers" style={{color: '#1F2937'}}>채용안내</Link>
      </div>
      <div>
        <button onClick={() => {/* Add functionality */}} style={{background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px'}}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2.5V9.5M2.5 6H9.5" stroke="#333D4B" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button onClick={() => {/* Add functionality */}} style={{background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px'}}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.5 1L8.5 6L3.5 11" stroke="#333D4B" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button onClick={() => {/* Add functionality */}} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 3L6 8L11 3" stroke="#333D4B" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
    <div style={{marginBottom: '10px'}}>
      © 2003-2024 주식회사 웍스아웃 | 통신판매업신고: 2014-서울마포-0219 | 호스팅사업자: 주식회사 아마존웹서비스 | 사업자등록번호: 106-86-85373
    </div>
    <div style={{marginBottom: '10px'}}>
      상호명: 주식회사 웍스아웃 | 주소: 서울시 마포구 월드컵북로23길 24 | 전자우편주소: customer@worksout.co.kr | 대표: 강승혁, 박선영 | 전화: 02-541-0854
    </div>
    <div>
      <Link to="/terms" style={{marginRight: '20px'}}>이용약관</Link>
      <Link to="/privacy" style={{marginRight: '20px'}}>개인정보취급 방침</Link>
      <Link to="/escrow" style={{color: '#1F2937'}}>구매안전 (에스크로) 서비스 가입사실 확인</Link>
    </div>
  </footer>
);

export default Footer;