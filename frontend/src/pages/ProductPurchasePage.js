import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/common/header';
import Footer from '../components/common/footer';

const PurchasePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    phone1: '',
    phone2: '',
    phone3: '',
    address: ''
  });
  const [couponCode, setCouponCode] = useState('쿠폰 선택');
  const [pointsToUse, setPointsToUse] = useState(0);

  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
  };

  const handlePointsChange = (e) => {
    setPointsToUse(e.target.value);
  };

  const applyPoints = () => {
    console.log(`Applying ${pointsToUse} points`);
  };

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
                    <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">주문자 전화번호</label>
                    <div className="flex gap-2">
                      <input type="text" className="w-24 p-2 border border-gray-300 rounded-md" placeholder="010" />
                      <input type="text" className="w-24 p-2 border border-gray-300 rounded-md" />
                      <input type="text" className="w-24 p-2 border border-gray-300 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 배송 정보 */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">배송 정보</h2>
                <div className="flex gap-4 mb-6">
                  <button className="px-4 py-2 bg-black text-white rounded-md">기존 배송지</button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md">신규 배송지</button>
                  <div className="ml-auto">
                    <button className="px-4 py-2 bg-gray-100 rounded-md">배송지 목록</button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">배송지명 *</label>
                    <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="집" />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">수취인 이름 *</label>
                    <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">수취인 전화번호 *</label>
                    <div className="flex gap-2">
                      <input type="text" className="w-24 p-2 border border-gray-300 rounded-md" placeholder="010" />
                      <input type="text" className="w-24 p-2 border border-gray-300 rounded-md" />
                      <input type="text" className="w-24 p-2 border border-gray-300 rounded-md" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">배송 주소 *</label>
                    <div className="flex gap-2 mb-2">
                      <input type="text" className="flex-1 p-2 border border-gray-300 rounded-md" />
                      <button className="px-4 py-2 bg-gray-100 rounded-md">검색</button>
                    </div>
                    <input type="text" className="w-full p-2 border border-gray-300 rounded-md mb-2" placeholder="상세주소" />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">배송 요청사항</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option>부재시 문앞에 보관해주세요</option>
                      <option>경비실에 맡겨주세요</option>
                      <option>배송 전 연락바랍니다</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 섹션 - 결제 정보 */}
          <div className="lg:w-1/4">
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
                    <span className="text-red-500">- 0 원</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>배송비</span>
                    <span>0 원</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl mt-4">
                    <span>총 결제 금액</span>
                    <span className="text-red-500">{product.w_price.toLocaleString()} 원</span>
                  </div>
                </div>
                <button className="w-full bg-red-500 text-white py-3 px-4 rounded-md mt-6 hover:bg-red-600 transition duration-300">
                  결제하기
                </button>
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
