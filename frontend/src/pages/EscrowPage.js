import React from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/footer';

const EscrowPage = () => (
  <div className="EscrowPage min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow p-8">
      <h1 className="text-3xl font-bold mb-4">구매안전 (에스크로) 서비스 가입사실 확인</h1>
      <p>
        트렌드코어는 고객님의 안전한 거래를 위해 구매안전 (에스크로) 서비스를 제공하고 있습니다. 
        에스크로 서비스는 전자상거래 등에서 구매자를 보호하기 위해 상품 대금의 지급을 제3자인 에스크로사업자가 예치하고, 구매자가 상품을 받은 후에 에스크로사업자가 판매자에게 대금을 지급하는 제도입니다.
      </p>
      <h2 className="text-2xl font-bold mb-2 mt-6">서비스 가입사실 확인</h2>
      <p>
        트렌드코어는 아래의 에스크로 서비스 제공업체와 계약을 체결하여 서비스를 제공하고 있습니다.
      </p>
      <ul className="list-disc pl-6">
        <li>에스크로 서비스 제공업체: 한국무역정보통신 (KTNET)</li>
        <li>에스크로 서비스 가입 확인 URL: https://www.trendcore.co.kr/escrow</li>
      </ul>
      <p>
        에스크로 서비스 가입 확인은 상단의 URL을 통해 하실 수 있습니다.
      </p>
      <h2 className="text-2xl font-bold mb-2 mt-6">에스크로 서비스 이용 방법</h2>
      <ol className="list-decimal pl-6">
        <li>상품 구매 시 결제 페이지에서 에스크로 서비스 이용을 선택합니다.</li>
        <li>구매 확인 후 에스크로사업자에게 대금이 예치됩니다.</li>
        <li>상품 수령 후 구매 확정을 진행합니다.</li>
        <li>구매 확정 후 에스크로사업자가 판매자에게 대금을 지급합니다.</li>
      </ol>
      {/* 추가 내용 */}
    </main>
    <Footer />
  </div>
);

export default EscrowPage;