import React from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/footer';

const AboutPage = () => (
  <div className="AboutPage min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow p-8">
      <h1 className="text-3xl font-bold mb-4">트렌드코어에 대하여</h1>
      <p>
        트렌드코어는 최신 패션 트렌드를 선도하는 온라인 쇼핑몰입니다. 
        우리는 고객님께 최고의 쇼핑 경험을 제공하기 위해 노력하고 있습니다.
      </p>
      {/* 추가 내용 */}
    </main>
    <Footer />
  </div>
);

export default AboutPage;