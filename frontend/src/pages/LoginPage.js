import React, { useState } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import KakaoLogin from '../components/KakaoLogin';
import { useNavigate } from 'react-router-dom';
import { checkTokenExpiration } from '../utils/auth';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = () => {
    navigate('/signup');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3005/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          ...data.user,
          isSocialLogin: false, // 일반 로그인의 경우
        }));
        checkTokenExpiration();
        alert('로그인 성공!');
        navigate('/');
      } else {
        setError(data.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error.message, error.stack);
      setError('서버와의 통신 중 오류가 발생했습니다.' + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6">
      <h2 className="text-2xl font-semibold mb-6">로그인</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm mb-1">아이디</label>
          <input
            type="email"
            placeholder="이메일을 입력해주세요."
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength="50"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요."
            className="w-full px-3 py-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength="100"
            required
          />
        </div>
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span>아이디 저장</span>
          </label>
          <div>
            <button type="button" className="text-gray-600">아이디 찾기</button>
            <span className="mx-2 text-gray-300">|</span>
            <button type="button" className="text-gray-600">비밀번호 찾기</button>
          </div>
        </div>
        <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded">
          로그인
        </button>
        <div className="text-center">
          <button type="button" className="text-sm text-gray-600">비회원 주문조회</button>
        </div>
      </form>
      <button type="button" className="w-full border border-gray-900 text-gray-900 py-3 rounded" onClick={handleSignUp}>
        회원가입
      </button>
      <KakaoLogin />
      <div className="mt-6 text-center text-sm">
        <p>신규회원 가입하고 <span className="text-red-500 underline">5% 할인 쿠폰</span> 받아보세요.</p>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;