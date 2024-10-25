import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import api from '../utils/api';
import { checkTokenExpiration } from '../utils/auth';

const MyPage = () => {
  const [activeTab, setActiveTab] = useState('전체 스토어');
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    gender: '',
    phone: '',
    address: '',
    registrationDate: '',
    membership: 'BASIC',
    points: 0,
    coupons: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        checkTokenExpiration();
        const response = await api.fetch('http://localhost:3005/api/user');

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const data = await response.json();
        setUserInfo({
          ...data,
          membership: 'BASIC',
          points: 0,
          coupons: 0
        });
      } catch (error) {
        console.error('Error fetching user info:', error);
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow max-w-[1920px] mx-auto px-6 py-8 w-full">
        <div className="bg-gray-50">
          <div className="grid grid-cols-4 divide-x divide-gray-200">
            <div className="px-8 py-6">
              <div className="text-gray-500 text-sm mb-2">회원 이름</div>
              <div className="text-lg">{userInfo.name}</div>
            </div>
            <div className="px-8 py-6">
              <div className="text-gray-500 text-sm mb-2">회원 등급</div>
              <div className="text-lg font-bold">BASIC</div>
            </div>
            <div className="px-8 py-6">
              <div className="text-gray-500 text-sm mb-2">포인트</div>
              <div className="text-lg">
                <span className="font-bold">0</span>원
              </div>
            </div>
            <div className="px-8 py-6 flex justify-between items-start">
              <div>
                <div className="text-gray-500 text-sm mb-2">쿠폰</div>
                <div className="text-lg">
                  <span className="font-bold">0</span>개
                </div>
              </div>
              <button className="text-black text-sm">
                내 정보 수정 &gt;
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8 mt-8">
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
                <li className="hover:text-gray-900 cursor-pointer">로그아웃</li>
              </ul>
            </div>
          </aside>

          <main className="flex-1">
            <h2 className="text-2xl font-medium mb-6">나의 주문</h2>
            <h3 className="text-lg mb-4">최근 주문 내역</h3>

            <div className="mb-4 flex gap-2">
              {['온라인 스토어', '오프라인 스토어'].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded transition-colors
                    ${activeTab === tab 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="min-h-[200px] flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
              {activeTab === '오프라인 스토어' && <p>구매내역이 없습니다.</p>}
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-medium mb-6">나의 정보</h2>
              <div className="space-y-4 bg-gray-50 p-8 rounded-lg">
                <div className="flex">
                  <span className="w-24 text-gray-500">이메일:</span>
                  <span>{userInfo.email || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-gray-500">성별:</span>
                  <span>{userInfo.gender || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-gray-500">전화번호:</span>
                  <span>{userInfo.phone || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-gray-500">주소:</span>
                  <span>{userInfo.address || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="w-24 text-gray-500">가입일:</span>
                  <span>
                    {userInfo.registrationDate 
                      ? new Date(userInfo.registrationDate).toLocaleDateString() 
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyPage;