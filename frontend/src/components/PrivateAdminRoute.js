import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!token || !user || !user.isAdmin) {
    return <Navigate to="/" replace />;  // 메인 페이지로 리다이렉트
  }

  return children;
};

export default PrivateAdminRoute;