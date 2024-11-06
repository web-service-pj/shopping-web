import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import axios from 'axios';

const PurchasePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // location.state 체크
  useEffect(() => {
    if (!location.state) {
      alert('잘못된 접근입니다.');
      navigate('/cart');
      return;
    }
  }, [location.state, navigate]);

  const { products: cartProducts, isCartPurchase } = location.state || {};
  const singleProduct = location.state?.product;
  
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

  // 세일 할인 금액 계산 
  const calculateDiscountAmount = () => {
    if (isCartPurchase && cartProducts) {
      return cartProducts.reduce((sum, item) => {
        if (item.isOnSale) {
          const originalPrice = typeof item.originalPrice === 'string' ?
            parseInt(item.originalPrice.replace(/[^0-9]/g, '')) :
            item.originalPrice;
          const salePrice = typeof item.price === 'string' ?
            parseInt(item.price.replace(/[^0-9]/g, '')) :
            item.price;
          return sum + ((originalPrice - salePrice) * item.quantity);
        }
        return sum;
      }, 0);
    }
  
    if (singleProduct?.isOnSale) {
      const originalPrice = singleProduct.w_price;
      const salePrice = Math.floor(originalPrice * 0.5);
      return originalPrice - salePrice;
    }
  
    return 0;
  };
  
  // 총 상품 금액 계산
  const calculateTotalPrice = () => {
    if (isCartPurchase && cartProducts) {
      return cartProducts.reduce((sum, item) => {
        const originalPrice = item.isOnSale ?
          (typeof item.originalPrice === 'string' ?
            parseInt(item.originalPrice.replace(/[^0-9]/g, '')) :
            item.originalPrice) :
          (typeof item.price === 'string' ?
            parseInt(item.price.replace(/[^0-9]/g, '')) :
            item.price);
        return sum + (originalPrice * item.quantity);
      }, 0);
    }
    
    if (singleProduct) {
      return singleProduct.w_price;
    }
    return 0;
  };
  

  // 유저 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/current-user', {
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
    const totalPrice = calculateTotalPrice();
    if (value > totalPrice) {
      alert('포인트는 상품 가격을 초과할 수 없습니다.');
      setPointsToUse(totalPrice);
      return;
    }
    setPointsToUse(value);
  };

  const applyPoints = () => {
    const points = parseInt(pointsToUse) || 0;
    if (points > (userInfo?.points || 0)) {
      alert('보유한 포인트를 초과하여 사용할 수 없습니다.');
      setPointsToUse(0);
      return;
    }
  };

  const handlePurchase = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // 배송 정보 유효성 검사
      if (!deliveryInfo.name || !deliveryInfo.phone1 || !deliveryInfo.phone2 || 
          !deliveryInfo.phone3 || !deliveryInfo.address) {
        alert('배송 정보를 모두 입력해주세요.');
        return;
      }

      const recipientPhoneNumber = `${deliveryInfo.phone1}-${deliveryInfo.phone2}-${deliveryInfo.phone3}`;
      const fullAddress = `${deliveryInfo.address} ${deliveryInfo.detailAddress}`.trim();

      if (isCartPurchase && cartProducts) {
        const purchasePromises = cartProducts.map(item => {
          const purchaseData = {
            wearidx: item.wearidx,
            selectedSize: item.selectedSize,
            quantity: item.quantity,
            recipientName: deliveryInfo.name,
            recipientPhone: recipientPhoneNumber,
            recipientAddress: fullAddress,
            deliveryRequest: deliveryInfo.deliveryRequest,
            totalAmount: item.price * item.quantity, // 이미 할인된 가격 사용
            usedPoint: Math.floor(pointsToUse / cartProducts.length),
            isCartPurchase: true
          };

          return axios.post(
            'http://localhost:5000/api/purchase',
            purchaseData,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
        });

        const results = await Promise.all(purchasePromises);
        const orderNumbers = results
          .filter(res => res?.data?.orderNumber)
          .map(res => res.data.orderNumber);

        if (orderNumbers.length > 0) {
          navigate('/payment-success', { 
            state: { orderNumbers: orderNumbers }
          });
        } else {
          throw new Error('주문 번호를 받지 못했습니다.');
        }
      } else if (singleProduct) {
        const finalPrice = singleProduct.isOnSale ? 
          parseInt(singleProduct.price.replace(/[^0-9]/g, '')) :
          singleProduct.w_price;

        const purchaseData = {
          wearidx: singleProduct.wearidx,
          selectedSize: singleProduct.selectedSize,
          quantity: 1,
          recipientName: deliveryInfo.name,
          recipientPhone: recipientPhoneNumber,
          recipientAddress: fullAddress,
          deliveryRequest: deliveryInfo.deliveryRequest,
          totalAmount: finalPrice,
          usedPoint: pointsToUse,
          isCartPurchase: false
        };

        const response = await axios.post(
          'http://localhost:5000/api/purchase',
          purchaseData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.orderNumber) {
          navigate('/payment-success', { 
            state: { orderNumber: response.data.orderNumber }
          });
        } else {
          throw new Error('주문 번호를 받지 못했습니다.');
        }
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

  const totalPrice = calculateTotalPrice();
  const discountAmount = calculateDiscountAmount();
  const pointsDiscount = pointsToUse;
  const finalPrice = totalPrice - discountAmount - pointsDiscount;

  const renderProducts = () => {
    if (isCartPurchase && cartProducts) {
      return cartProducts.map((item, index) => (
        <tr key={index} className="border-b">
          <td className="py-4 px-4">
            <div className="flex items-center">
              <div className="w-24 h-50 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-500 mt-1">브랜드: {item.brand}</p>
                <p className="text-gray-500">사이즈: {item.selectedSize}</p>
                <p className="text-gray-500">상품 코드: {item.w_code}</p>
              </div>
            </div>
          </td>
          <td className="text-center py-4 px-4">
            {item.quantity}
          </td>
          <td className="text-center py-4 px-4">
            {item.isOnSale ? (
              <div>
                <p className="line-through text-gray-400">
                  {typeof item.originalPrice === 'string' 
                    ? item.originalPrice 
                    : `${item.originalPrice.toLocaleString()}원`}
                </p>
                <p className="font-semibold text-red-500">
                  {(typeof item.price === 'string' 
                    ? parseInt(item.price.replace(/[^0-9]/g, '')) * item.quantity 
                    : item.price * item.quantity).toLocaleString()}원
                </p>
              </div>
            ) : (
              <p className="font-semibold">
                {(item.price * item.quantity).toLocaleString()}원
              </p>
            )}
          </td>
        </tr>
      ));
    } else if (singleProduct) {
      return (
        <tr className="border-b">
          <td className="py-4 px-4">
            <div className="flex items-center">
              <div className="w-24 h-50 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4">
                <img 
                  src={singleProduct.image} 
                  alt={singleProduct.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{singleProduct.name}</h3>
                <p className="text-gray-500 mt-1">브랜드: {singleProduct.brand}</p>
                <p className="text-gray-500">사이즈: {singleProduct.selectedSize}</p>
                <p className="text-gray-500">상품 코드: {singleProduct.w_code}</p>
              </div>
            </div>
          </td>
          <td className="text-center py-4 px-4">1</td>
          <td className="text-center py-4 px-4">
            {singleProduct.isOnSale ? (
              <div>
                <p className="line-through text-gray-400">
                  {singleProduct.w_price.toLocaleString()}원
                </p>
                <p className="font-semibold text-red-500">
                  {Math.floor(singleProduct.w_price * 0.5).toLocaleString()}원
                </p>
              </div>
            ) : (
              <p className="font-semibold">
                {singleProduct.w_price.toLocaleString()}원
              </p>
            )}
          </td>
        </tr>
      );
    }
  };

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
                    {renderProducts()}
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
                        value={userInfo.phone.split('-')[0]} 
                        readOnly
                        className="w-24 p-2 border border-gray-300 rounded-md bg-gray-50" 
                      />
                      <input 
                        type="text" 
                        value={userInfo.phone.split('-')[1]} 
                        readOnly
                        className="w-24 p-2 border border-gray-300 rounded-md bg-gray-50" 
                      />
                      <input 
                        type="text" 
                        value={userInfo.phone.split('-')[2]} 
                        readOnly
                        className="w-24 p-2 border border-gray-300 rounded-md bg-gray-50" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 배송 정보 */}
            <div className="bg-white rounded-lg shadow-md mb-8">
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
                      placeholder="기본 주소"
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
                      <option value="직접입력">직접입력</option>
                    </select>
                    {deliveryInfo.deliveryRequest === '직접입력' && (
                      <input
                        type="text"
                        name="deliveryRequestCustom"
                        onChange={handleDeliveryInfoChange}
                        className="w-full p-2 border border-gray-300 rounded-md mt-2"
                        placeholder="배송 요청사항을 입력해주세요"
                      />
                    )}
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
                    <p className="text-sm text-gray-500 mt-1">
                      보유 포인트: {(userInfo?.points || 0).toLocaleString()}P
                    </p>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>상품 금액</span>
                      <span>{totalPrice.toLocaleString()} 원</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between mb-2">
                        <span>세일 할인</span>
                        <span className="text-red-500">- {discountAmount.toLocaleString()} 원</span>
                      </div>
                    )}
                    {pointsDiscount > 0 && (
                      <div className="flex justify-between mb-2">
                        <span>포인트 할인</span>
                        <span className="text-red-500">- {pointsDiscount.toLocaleString()} 원</span>
                      </div>
                    )}
                    <div className="flex justify-between mb-2">
                      <span>배송비</span>
                      <span>0 원</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl mt-4">
                      <span>총 결제 금액</span>
                      <span className="text-red-500">
                        {finalPrice.toLocaleString()} 원
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handlePurchase}
                    className="w-full bg-red-500 text-white py-3 px-4 rounded-md mt-6 hover:bg-red-600 transition duration-300 text-lg font-bold"
                  >
                    결제하기
                  </button>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>· 주문 내용을 확인하였으며, 정보 제공 등에 동의합니다.</p>
                    <p>· 결제 후 주문 내용을 변경할 수 없습니다.</p>
                  </div>
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