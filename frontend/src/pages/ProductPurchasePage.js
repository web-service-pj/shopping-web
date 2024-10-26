import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import axios from 'axios';

const PurchasePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;
  
  // 유저 정보 상태
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 배송 정보 상태
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    phone1: '',
    phone2: '',
    phone3: '',
    address: '',
    detailAddress: '',
    deliveryRequest: '부재시 문앞에 보관해주세요'
  });

  const [couponCode, setCouponCode] = useState('쿠폰 선택');
  const [pointsToUse, setPointsToUse] = useState(0);

  // 유저 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:3005/api/current-user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserInfo(response.data);
        
        // 전화번호 파싱
        const phoneParts = response.data.phone.split('-');
        
        // 배송 정보 초기값 설정
        setDeliveryInfo({
          name: response.data.name,
          phone1: phoneParts[0] || '',
          phone2: phoneParts[1] || '',
          phone3: phoneParts[2] || '',
          address: response.data.address,
          detailAddress: '',
          deliveryRequest: '부재시 문앞에 보관해주세요'
        });

        setLoading(false);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        setError('사용자 정보를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // 배송 정보 변경 핸들러
  const handleDeliveryInfoChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
  };

  const handlePointsChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    // 포인트는 상품 가격을 초과할 수 없음
    if (value > product.w_price) {
      alert('포인트는 상품 가격을 초과할 수 없습니다.');
      setPointsToUse(product.w_price);
      return;
    }
    setPointsToUse(value);
  };

  const applyPoints = () => {
    const points = parseInt(pointsToUse) || 0;
    if (points > (userInfo.points || 0)) {
      alert('보유한 포인트를 초과하여 사용할 수 없습니다.');
      setPointsToUse(0);
      return;
    }
    // 포인트 적용 후 최종 금액 계산
    const finalAmount = Math.max(0, product.w_price - points);
    console.log(`포인트 적용 후 최종 금액: ${finalAmount}원`);
  };

  const handlePurchase = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
  
      // 입력값 검증
      if (!deliveryInfo.name || !deliveryInfo.phone1 || !deliveryInfo.phone2 || !deliveryInfo.phone3 || !deliveryInfo.address) {
        alert('배송 정보를 모두 입력해주세요.');
        return;
      }
  
      // 구매 요청
      const response = await axios.post(
        'http://localhost:3005/api/purchase',
        {
          wearidx: product.wearidx,
          selectedSize: product.selectedSize, // 선택한 사이즈 추가
          quantity: 1,
          recipientName: deliveryInfo.name,
          recipientPhone: `${deliveryInfo.phone1}-${deliveryInfo.phone2}-${deliveryInfo.phone3}`,
          recipientAddress: `${deliveryInfo.address} ${deliveryInfo.detailAddress}`.trim(),
          deliveryRequest: deliveryInfo.deliveryRequest,
          totalAmount: product.w_price,
          usedPoint: parseInt(pointsToUse) || 0
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      if (response.data.orderNumber) {
        navigate('/payment-success', { 
          state: { orderNumber: response.data.orderNumber }
        });
      }
  
    } catch (error) {
      console.error('구매 처리 실패:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('주문 처리 중 오류가 발생했습니다.');
      }
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>상품 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-[1920px] mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">주문/결제</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 왼쪽 섹션 */}
          <div className="lg:w-3/4">
            {/* 주문 상품 정보 */}
            <div className="bg-white rounded-lg shadow-md mb-8">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">주문 상품</h2>
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="border-b">
                      <th className="w-1/2 text-left py-2 px-4">상품 정보</th>
                      <th className="w-1/6 text-center py-2 px-4">수량</th>
                      <th className="w-1/3 text-center py-2 px-4">가격</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-24 h-50 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-gray-500 mt-1">브랜드: {product.brand}</p>
                            <p className="text-gray-500">사이즈: {product.selectedSize}</p>
                            <p className="text-gray-500">상품 코드: {product.w_code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        1
                      </td>
                      <td className="text-center font-semibold py-4 px-4">
                        {product.w_price.toLocaleString()}원
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 주문자 정보 */}
            <div className="bg-white rounded-lg shadow-md mb-8">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">주문자 정보</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">주문자 이름</label>
                    <input 
                      type="text" 
                      value={userInfo.name} 
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-md bg-gray-50" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">주문자 전화번호</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={deliveryInfo.phone1} 
                        readOnly
                        className="w-24 p-2 border border-gray-300 rounded-md bg-gray-50" 
                      />
                      <input 
                        type="text" 
                        value={deliveryInfo.phone2} 
                        readOnly
                        className="w-24 p-2 border border-gray-300 rounded-md bg-gray-50" 
                      />
                      <input 
                        type="text" 
                        value={deliveryInfo.phone3} 
                        readOnly
                        className="w-24 p-2 border border-gray-300 rounded-md bg-gray-50" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 배송 정보 */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">배송 정보</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">수취인 이름 *</label>
                    <input 
                      type="text"
                      name="name"
                      value={deliveryInfo.name}
                      onChange={handleDeliveryInfoChange}
                      className="w-full p-2 border border-gray-300 rounded-md" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">수취인 전화번호 *</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        name="phone1"
                        value={deliveryInfo.phone1}
                        onChange={handleDeliveryInfoChange}
                        className="w-24 p-2 border border-gray-300 rounded-md"
                        maxLength="3"
                      />
                      <input 
                        type="text"
                        name="phone2"
                        value={deliveryInfo.phone2}
                        onChange={handleDeliveryInfoChange}
                        className="w-24 p-2 border border-gray-300 rounded-md"
                        maxLength="4"
                      />
                      <input 
                        type="text"
                        name="phone3"
                        value={deliveryInfo.phone3}
                        onChange={handleDeliveryInfoChange}
                        className="w-24 p-2 border border-gray-300 rounded-md"
                        maxLength="4"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">배송 주소 *</label>
                    <input 
                      type="text"
                      name="address"
                      value={deliveryInfo.address}
                      onChange={handleDeliveryInfoChange}
                      className="w-full p-2 border border-gray-300 rounded-md mb-2"
                    />
                    <input 
                      type="text"
                      name="detailAddress"
                      value={deliveryInfo.detailAddress}
                      onChange={handleDeliveryInfoChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="상세주소"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">배송 요청사항</label>
                    <select
                      name="deliveryRequest"
                      value={deliveryInfo.deliveryRequest}
                      onChange={handleDeliveryInfoChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="부재시 문앞에 보관해주세요">부재시 문앞에 보관해주세요</option>
                      <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                      <option value="배송 전 연락바랍니다">배송 전 연락바랍니다</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 섹션 - 결제 정보 */}
          <div className="lg:w-1/4">
            <div className="sticky top-4">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">결제 정보</h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">쿠폰 적용</label>
                    <select
                      value={couponCode}
                      onChange={handleCouponChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">쿠폰 선택</option>
                      <option value="SAVE10">10% 할인 쿠폰</option>
                      <option value="SAVE20">20% 할인 쿠폰</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">포인트 사용</label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={pointsToUse}
                        onChange={handlePointsChange}
                        className="w-2/3 p-2 border rounded-l-md"
                       placeholder="사용할 포인트"
                     />
                     <button
                       onClick={applyPoints}
                       className="w-1/3 bg-gray-800 text-white p-2 rounded-r-md hover:bg-gray-700 transition duration-300"
                     >
                       적용
                     </button>
                   </div>
                 </div>
                 <div className="border-t pt-4">
                   <div className="flex justify-between mb-2">
                     <span>상품 금액</span>
                     <span>{product.w_price.toLocaleString()} 원</span>
                   </div>
                   <div className="flex justify-between mb-2">
                     <span>할인 금액</span>
                     <span className="text-red-500">- {pointsToUse.toLocaleString()} 원</span>
                   </div>
                   <div className="flex justify-between mb-2">
                     <span>배송비</span>
                     <span>0 원</span>
                   </div>
                   <div className="flex justify-between font-bold text-xl mt-4">
                     <span>총 결제 금액</span>
                     <span className="text-red-500">
                       {(product.w_price - pointsToUse).toLocaleString()} 원
                     </span>
                   </div>
                 </div>
                 <button 
                   onClick={handlePurchase}
                   className="w-full bg-red-500 text-white py-3 px-4 rounded-md mt-6 hover:bg-red-600 transition duration-300 text-lg font-bold"
                 >
                   결제하기
                 </button>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
     <Footer />
   </div>
 );
};

export default PurchasePage;