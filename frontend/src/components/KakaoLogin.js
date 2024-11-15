import React, { useEffect } from 'react';

const KAKAO_CLIENT_ID = 'bdefbf8f8e8a3420efdacb22f0fdc63e';
const KAKAO_REDIRECT_URI = 'https://www.trendcore.store/oauth/kakao/callback';

const KakaoLogin = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Kakao) {
        try {
          window.Kakao.init(KAKAO_CLIENT_ID);
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
      window.Kakao.Auth.cleanup(); // 기존 인증 정보 정리
      const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code&prompt=login`;
      window.location.href = KAKAO_AUTH_URL;
    } else {
      console.log('Kakao SDK not loaded');
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