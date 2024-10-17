import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/header';
import Footer from '../components/common/footer';

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [couponCode, setCouponCode] = useState('쿠폰 선택');
  const [pointsToUse, setPointsToUse] = useState(0);

  useEffect(() => {
    // 예시 상품 데이터
    const sampleItem = {
      id: 'ITEM001',
      name: '클래식 데님 재킷',
      size: 'M',
      price: 89000,
      quantity: 1,
      image: '/api/placeholder/240/240',
      brand: 'TrendCore',
    };
    setCartItems([sampleItem]);
    calculateTotal([sampleItem]);
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(total);
  };

  const updateQuantity = (id, change) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const removeItem = (id) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
  };

  const handlePointsChange = (e) => {
    setPointsToUse(e.target.value);
  };

  const applyPoints = () => {
    console.log(`Applying ${pointsToUse} points`);
  };

  const handleCheckout = () => {
    console.log('Proceeding to checkout');
    // navigate('/checkout');
  };

  return (
    <div className="ShoppingCartPage bg-opacity-95 min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">장바구니</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md border border-[#F3F4F6]">
              <div className="p-6">
                {cartItems.length === 0 ? (
                  <p className="text-center text-gray-500">장바구니가 비어 있습니다.</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#F3F4F6]">
                        <th className="text-left py-2 px-4 w-1/2">상품 정보</th>
                        <th className="text-center py-2 px-4 w-1/6">수량</th>
                        <th className="text-center py-2 px-4 w-1/6">가격</th>
                        <th className="text-center py-2 px-4 w-1/6">비고</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map(item => (
                        <tr key={item.id} className="border-b border-[#F3F4F6]">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <input type="checkbox" className="mr-4" />
                              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover mr-6" />
                              <div>
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-gray-500 mt-1">브랜드: {item.brand}</p>
                                <p className="text-gray-500">사이즈: {item.size}</p>
                                <p className="text-gray-500">상품번호: {item.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-4 px-4">
                            <div className="flex items-center justify-center">
                              <div className="flex border border-gray-300 rounded-md">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="px-3 py-1 border-r border-gray-300 hover:bg-gray-100 transition duration-300"
                                >
                                  −
                                </button>
                                <span className="px-3 py-1 font-semibold">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="px-3 py-1 border-l border-gray-300 hover:bg-gray-100 transition duration-300"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="text-center font-semibold py-4 px-4">{item.price.toLocaleString()}원</td>
                          <td className="text-center py-4 px-4">
                            <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 transition duration-300">삭제</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md border border-[#F3F4F6]">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">주문 요약</h2>
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
                <div className="border-t border-[#F3F4F6] pt-4">
                  <div className="flex justify-between mb-2">
                    <span>상품 금액</span>
                    <span>{totalPrice.toLocaleString()} 원</span>
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
                    <span className="text-red-500">{totalPrice.toLocaleString()} 원</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-red-500 text-white py-3 px-4 rounded-md mt-6 hover:bg-red-600 transition duration-300"
                >
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

export default ShoppingCartPage;