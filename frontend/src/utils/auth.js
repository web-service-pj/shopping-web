import { jwtDecode } from 'jwt-decode'; 

export const checkTokenExpiration = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        logout();
      }
    } catch (error) {
      console.error('Invalid token:', error);
      logout();
    }
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};