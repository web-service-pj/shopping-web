import React from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/footer';

const TermsPage = () => (
  <div className="TermsPage min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow p-8">
      <h1 className="text-3xl font-bold mb-4">이용약관</h1>
      <h2 className="text-2xl font-bold mb-2">제1조 (목적)</h2>
      <p>
        이 약관은 트렌드코어가 제공하는 모든 서비스의 이용조건 및 절차, 이용자와 트렌드코어의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
      </p>
      {/* 추가 내용 */}
      <h2 className="text-2xl font-bold mb-2 mt-6">제2조 (정의)</h2>
      <p>
        이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
      </p>
      <ul className="list-disc pl-6">
        <li>이용자: 트렌드코어에 접속하여 이 약관에 따라 트렌드코어가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
        <li>회원: 트렌드코어에 개인정보를 제공하여 회원등록을 한 자로서, 트렌드코어의 정보를 지속적으로 제공받으며, 트렌드코어가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
        <li>비회원: 회원에 가입하지 않고 트렌드코어가 제공하는 서비스를 이용하는 자를 말합니다.</li>
      </ul>
      {/* 추가 내용 */}
    </main>
    <Footer />
  </div>
);

export default TermsPage;