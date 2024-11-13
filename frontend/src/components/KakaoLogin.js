import React, { useEffect } from 'react';

const KakaoLogin = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Kakao) {
        try {
          window.Kakao.init(process.env.REACT_APP_KAKAO_CLIENT_ID);
          console.log('Kakao SDK initialized');
        } catch (error) {
          console.error('Kakao SDK initialization error:', error);
        }
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleKakaoLogin = () => {
    if (window.Kakao && window.Kakao.Auth) {
      try {
        window.Kakao.Auth.cleanup();
        const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URI}&response_type=code&prompt=login`;
        window.location.href = KAKAO_AUTH_URL;
      } catch (error) {
        console.error('Kakao login error:', error);
        alert('카카오 로그인 중 오류가 발생했습니다.');
      }
    } else {
      console.error('Kakao SDK not loaded');
      alert('카카오 로그인을 위한 준비가 되지 않았습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <button 
      onClick={handleKakaoLogin}
      className="w-full bg-[#FEE500] text-gray-900 py-3 rounded flex items-center justify-center"
    >
      <img 
        src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png" 
        alt="Kakao Logo" 
        className="mr-2 h-5"
      />
      카카오 로그인
    </button>
  );
};

export default KakaoLogin;