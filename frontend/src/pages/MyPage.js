import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import axios from 'axios';

const api = axios.create({
  baseURL: '',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const OrderStatus = {
  PENDING: '배송 준비중',
  SHIPPING: '배송중',
  DELIVERED: '배송 완료',
  CANCELED: '주문 취소'
};

const MyPage = () => {
  const [activeTab, setActiveTab] = useState('온라인 스토어');
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 사용자 정보 가져오기
        const userResponse = await api.get('/api/user');
        setUserInfo({
          ...userResponse.data,
          membership: 'BASIC',
          points: 0,
          coupons: 0
        });

        // 주문 내역 가져오기
        const ordersResponse = await api.get('/api/purchases');
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error('데이터 조회 실패:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPING':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const OrderItem = ({ order }) => {
    const imagePath = order.Wear?.w_path ? 
      order.Wear.w_path.split(',')[0].trim() : 
      '/api/placeholder/240/240';

    return (
      <div className="border rounded-lg p-6 mb-4 bg-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">{new Date(order.purchase_date).toLocaleDateString()}</p>
            <p className="font-medium">주문번호: {order.order_number}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeColor(order.status)}`}>
            {OrderStatus[order.status] || order.status}
          </span>
        </div>

        <div className="flex gap-4">
          <div className="w-40 h-70 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
            <img
              src={imagePath}
              alt={order.Wear?.w_name || '상품 이미지'}
              className="h-full w-full object-cover object-center"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/api/placeholder/240/240';
              }}
            />
          </div>
          <div className="flex-grow">
            <p className="font-medium mb-1">{order.Wear?.w_brand}</p>
            <p className="text-gray-600 mb-2">{order.Wear?.w_name}</p>
            <p className="text-sm text-gray-500">
              {order.size && `사이즈: ${order.size}`}
            </p>
            <p className="font-bold mt-2">
              {order.total_amount?.toLocaleString()}원
              {order.used_point > 0 && (
                <span className="text-sm text-gray-500 ml-2">
                  (포인트 사용: {order.used_point.toLocaleString()}원)
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            수령인: {order.recipient_name}
          </p>
          <p className="text-sm text-gray-600">
            연락처: {order.recipient_phone}
          </p>
          <p className="text-sm text-gray-600">
            배송지: {order.recipient_address}
          </p>
          {order.delivery_request && (
            <p className="text-sm text-gray-600 mt-1">
              요청사항: {order.delivery_request}
            </p>
          )}
        </div>
      </div>
    );
  };

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
                <li 
                  className="hover:text-gray-900 cursor-pointer"
                  onClick={handleLogout}
                >
                  로그아웃
                </li>
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

            {activeTab === '온라인 스토어' && (
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">로딩 중...</div>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <OrderItem key={order.order_number} order={order} />
                  ))
                ) : (
                  <div className="min-h-[200px] flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
                    <p>주문 내역이 없습니다.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === '오프라인 스토어' && (
              <div className="min-h-[200px] flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
                <p>구매내역이 없습니다.</p>
              </div>
            )}

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