import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const KakaoCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getKakaoToken = async () => {
      const code = new URLSearchParams(location.search).get('code');
      console.log('Received code:', code);  // 코드 확인

      try {
        // 백엔드 요청 전 로그
        console.log('Sending request to:', 'http://localhost:5000/api/auth/kakao');
        
        const response = await axios.post(
          'http://localhost:5000/api/auth/kakao', 
          { code },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        // 응답 데이터 확인
        console.log('Response data:', response.data);

        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        alert('카카오 로그인이 완료되었습니다!');
        navigate('/');
      } catch (error) {
        // 자세한 에러 로깅
        console.error('카카오 로그인 에러:', error);
        console.error('에러 상세:', error.response?.data);
        console.error('에러 상태:', error.response?.status);
        alert(`카카오 로그인에 실패했습니다. 에러: ${error.response?.data?.message || error.message}`);
        navigate('/login');
      }
    };

    getKakaoToken();
  }, [location, navigate]);

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoCallback;