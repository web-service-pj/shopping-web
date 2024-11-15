import React from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/footer';

const ContactPage = () => (
  <div className="ContactPage min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow p-8">
      <h1 className="text-3xl font-bold mb-4">문의하기</h1>
      <p>
        트렌드코어에 대한 문의사항이 있으시면 아래 연락처로 연락 주시기 바랍니다.
      </p>
      <ul>
        <li>전화: 063-270-1234</li>
        <li>이메일: customer@trendcore.co.kr</li>
      </ul>
      {/* 추가 내용 */}
    </main>
    <Footer />
  </div>
);

export default ContactPage;