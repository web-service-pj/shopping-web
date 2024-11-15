import React from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/footer';

const PrivacyPage = () => (
  <div className="PrivacyPage min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow p-8">
      <h1 className="text-3xl font-bold mb-4">개인정보취급 방침</h1>
      <h2 className="text-2xl font-bold mb-2">1. 개인정보의 처리 목적</h2>
      <p>
        트렌드코어는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
      </p>
      <ul className="list-disc pl-6">
        <li>재화 또는 서비스 제공</li>
        <li>회원 관리</li>
        <li>마케팅 및 광고에의 활용</li>
      </ul>
      {/* 추가 내용 */}
      <h2 className="text-2xl font-bold mb-2 mt-6">2. 개인정보의 처리 및 보유 기간</h2>
      <p>
        ① 트렌드코어는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
      </p>
      <p>
        ② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
      </p>
      <ul className="list-disc pl-6">
        <li>재화 또는 서비스 제공: 재화·서비스 공급완료 및 요금결제·정산 완료시까지</li>
        <li>회원 관리: 회원탈퇴 시까지</li>
      </ul>
      {/* 추가 내용 */}
    </main>
    <Footer />
  </div>
);

export default PrivacyPage;