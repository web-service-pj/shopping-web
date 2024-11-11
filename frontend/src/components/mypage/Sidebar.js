import React from 'react';

const Sidebar = ({ onLogout }) => {
  return (
    <aside className="w-64">
      <div className="mb-8">
        <h3 className="font-medium text-lg mb-4">나의 주문</h3>
        <ul className="space-y-3 text-gray-600">
          <li className="hover:text-gray-900 cursor-pointer">전체 주문 내역</li>
          <li className="hover:text-gray-900 cursor-pointer">결제 취소 내역</li>
          <li className="hover:text-gray-900 cursor-pointer">반품 내역</li>
        </ul>
      </div>

      <div className="mb-8">
        <h3 className="font-medium text-lg mb-4">나의 정보</h3>
        <ul className="space-y-3 text-gray-600">
          <li className="hover:text-gray-900 cursor-pointer">내 정보 수정</li>
          <li className="hover:text-gray-900 cursor-pointer">적립금 & 예치금</li>
          <li className="hover:text-gray-900 cursor-pointer">쿠폰 현황</li>
          <li className="hover:text-gray-900 cursor-pointer">응모 현황</li>
        </ul>
      </div>

      <div>
        <h3 className="font-medium text-lg mb-4">고객센터</h3>
        <ul className="space-y-3 text-gray-600">
          <li className="hover:text-gray-900 cursor-pointer">자주 묻는 질문</li>
          <li 
            className="hover:text-gray-900 cursor-pointer"
            onClick={onLogout}
          >
            로그아웃
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;