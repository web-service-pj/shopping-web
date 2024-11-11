import React from 'react';

const UserInfoCard = ({ userInfo, onChargePoints }) => {
  return (
    <div className="bg-gray-50">
      <div className="grid grid-cols-4 divide-x divide-gray-200">
        <div className="px-8 py-6">
          <div className="text-gray-500 text-sm mb-2">회원 이름</div>
          <div className="text-lg">{userInfo.name}</div>
        </div>
        <div className="px-8 py-6">
          <div className="text-gray-500 text-sm mb-2">회원 등급</div>
          <div className="text-lg font-bold">{userInfo.membership}</div>
        </div>
        <div className="px-8 py-6">
          <div className="text-gray-500 text-sm mb-2">포인트</div>
          <div className="text-lg flex items-center gap-2">
            <span className="font-bold">{userInfo.points.toLocaleString()}</span>원
            <button
              onClick={onChargePoints}
              className="text-sm px-2 py-1 bg-black text-white rounded hover:bg-gray-800"
            >
              충전
            </button>
          </div>
        </div>
        <div className="px-8 py-6 flex justify-between items-start">
          <div>
            <div className="text-gray-500 text-sm mb-2">쿠폰</div>
            <div className="text-lg">
              <span className="font-bold">{userInfo.coupons}</span>개
            </div>
          </div>
          <button className="text-black text-sm">
            내 정보 수정 &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;