import React from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/footer';

const SupportPage = () => (
  <div className="SupportPage min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow p-8">
      <h1 className="text-3xl font-bold mb-4">고객지원</h1>
      <p>
        트렌드코어는 고객님의 만족을 최우선으로 생각합니다. 
        문의사항이 있으시면 언제든지 연락 주시기 바랍니다.
      </p>
      {/* 추가 내용 */}
    </main>
    <Footer />
  </div>
);

export default SupportPage;