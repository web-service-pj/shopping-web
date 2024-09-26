import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

const LoginForm = () => {
  return (
    <div className="max-w-md mx-auto mt-8 p-6">
      <h2 className="text-2xl font-semibold mb-6">로그인</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm mb-1">아이디</label>
          <input
            type="email"
            placeholder="이메일을 입력해주세요."
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요."
            className="w-full px-3 py-2 border border-gray-300 rounded"
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
        <button type="button" className="w-full border border-gray-900 text-gray-900 py-3 rounded">
          회원가입
        </button>
        <div className="text-center">
          <button type="button" className="text-sm text-gray-600">비회원 주문조회</button>
        </div>
      </form>
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