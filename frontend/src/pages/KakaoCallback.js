import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const KakaoCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getKakaoToken = async () => {
      const code = new URLSearchParams(location.search).get('code');
      try {
        const response = await axios.post('http://localhost:3005/api/auth/kakao', { code });
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        alert('카카오 로그인이 완료되었습니다!');
        navigate('/');
      } catch (error) {
        alert('카카오 로그인에 실패했습니다.');
        navigate('/login');
      }
    };

    getKakaoToken();
  }, [location, navigate]);

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoCallback;