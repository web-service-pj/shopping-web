import { checkTokenExpiration } from './auth';

const api = {
  fetch: async (url, options = {}) => {
    checkTokenExpiration();
    const token = localStorage.getItem('token');
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    const response = await fetch(url, options);
    if (response.status === 401) {
      checkTokenExpiration();
    }
    return response;
  }
};

export default api;