import { jwtDecode } from 'jwt-decode';

export const checkTokenExpiration = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Invalid token:', error);
      logout();
      return false;
    }
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
    window.Kakao.Auth.logout(() => {
      console.log('카카오 로그아웃 완료');
    });
  }

  window.location.href = '/login';
};