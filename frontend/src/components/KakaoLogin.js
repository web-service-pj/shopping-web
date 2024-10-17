import React, { useEffect } from 'react';

const KakaoLogin = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Kakao) {
        window.Kakao.init(process.env.REACT_APP_KAKAO_CLIENT_ID);
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleKakaoLogin = () => {
    if (window.Kakao && window.Kakao.Auth) {
      window.Kakao.Auth.cleanup(); // 기존 인증 정보 정리
      const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URI}&response_type=code&prompt=login`;
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