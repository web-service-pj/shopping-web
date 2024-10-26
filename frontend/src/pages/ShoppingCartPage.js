import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3005',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Request headers:', config.headers);
    } else {
      console.log('No token found in localStorage');
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [couponCode, setCouponCode] = useState('쿠폰 선택');
  const [pointsToUse, setPointsToUse] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      console.log('Fetching cart items...');
      const response = await api.get('/api/shopping-cart');
      console.log('API Response:', response.data);
  
      if (response.data.length === 0) {
        console.log('Cart is empty');
        setCartItems([]);
        setTotalPrice(0);
        return;
      }
  
      const items = response.data.map(item => ({
        id: item.cart_idx,
        name: item.wear ? item.wear.w_name : 'Unknown Product',
        size: 'N/A',
        price: item.wear ? item.wear.w_price : 0,
        quantity: item.quantity,
        image: item.wear && item.wear.w_path ? item.wear.w_path.split(',')[0].trim() : '/api/placeholder/240/240',
        brand: item.wear ? item.wear.w_brand : 'Unknown Brand',
        w_code: item.w_code,
        w_gender: item.w_gender,
      }));
  
      console.log('Processed items:', items);
      setCartItems(items);
      calculateTotal(items);
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      if (error.response && error.response.status === 401) {
        alert('로그인이 필요합니다.');
        navigate('/login');
      } else {
        alert('장바구니 정보를 불러오는데 실패했습니다.');
      }
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(total);
  };

  const updateQuantity = async (id, change) => {
    try {
      const item = cartItems.find(item => item.id === id);
      if (!item) {
        console.error('Item not found:', id);
        return;
      }
  
      const newQuantity = Math.max(1, item.quantity + change);
      console.log('Updating quantity for item:', id, 'to:', newQuantity);
  
      const response = await api.put(`/api/shopping-cart/${id}`, { 
        quantity: newQuantity 
      });
  
      if (response.data.cartItem) {
        const updatedItem = {
          id: response.data.cartItem.cart_idx,
          name: response.data.cartItem.Wear ? response.data.cartItem.Wear.w_name : item.name,
          size: item.size,
          price: response.data.cartItem.Wear ? response.data.cartItem.Wear.w_price : item.price,
          quantity: response.data.cartItem.quantity,
          image: response.data.cartItem.Wear && response.data.cartItem.Wear.w_path ? 
            response.data.cartItem.Wear.w_path.split(',')[0].trim() : item.image,
          brand: response.data.cartItem.Wear ? response.data.cartItem.Wear.w_brand : item.brand,
          w_code: response.data.cartItem.w_code,
          w_gender: response.data.cartItem.w_gender,
        };
  
        const updatedItems = cartItems.map(cartItem => 
          cartItem.id === id ? updatedItem : cartItem
        );
  
        console.log('Updated cart items:', updatedItems);
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
      } else {
        const updatedItems = cartItems.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
      }
      
      console.log('Successfully updated cart item quantity');
    } catch (error) {
      console.error('Failed to update quantity:', error);
      
      if (error.response) {
        if (error.response.status === 401) {
          alert('로그인이 필요합니다.');
          navigate('/login');
        } else if (error.response.status === 400) {
          alert(error.response.data.message || '수량 변경에 실패했습니다.');
          
          if (error.response.data.availableStock) {
            const updatedItems = cartItems.map(cartItem => 
              cartItem.id === id ? { ...cartItem, quantity: error.response.data.availableStock } : cartItem
            );
            setCartItems(updatedItems);
            calculateTotal(updatedItems);
          } else {
            fetchCartItems();
          }
        } else {
          alert('수량 변경에 실패했습니다.');
        }
      } else if (error.request) {
        alert('서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.');
        fetchCartItems();
      } else {
        alert('수량 변경 중 오류가 발생했습니다.');
        fetchCartItems();
      }
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/api/shopping-cart/${id}`);
      const updatedItems = cartItems.filter(item => item.id !== id);
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      console.error('Failed to remove item:', error);
      alert('상품 삭제에 실패했습니다.');
    }
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
  };

  const handleProductClick = async (item) => {
    try {
      const response = await api.get(`/api/products/${item.w_code}`);
      if (response.data) {
        const product = {
          ...response.data,
          image: response.data.w_path.split(',')[0].trim(),
          brand: response.data.w_brand,
          name: response.data.w_name,
          price: `${response.data.w_price.toLocaleString()}원`,
          category: response.data.w_category,
        };
        const gender = product.w_gender === 0 ? 'men' : 'women';
        navigate(`/${gender}/${product.w_code}`, { state: { product } });
      }
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      alert('상품 정보를 불러오는데 실패했습니다.');
    }
  };

  return (
    <div className="ShoppingCartPage min-h-screen">
      <Header />
      <div className="max-w-[1920px] mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">장바구니</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                {cartItems.length === 0 ? (
                  <p className="text-center text-gray-500">장바구니가 비어 있습니다.</p>
                ) : (
                  <table className="w-full table-fixed">
                    <thead>
                      <tr className="border-b">
                        <th className="w-1/2 text-left py-2 px-4">상품 정보</th>
                        <th className="w-1/6 text-center py-2 px-4">수량</th>
                        <th className="w-1/6 text-center py-2 px-4">가격</th>
                        <th className="w-1/6 text-center py-2 px-4">비고</th>
                      </tr>
                    </thead>
                    <tbody>
                    {cartItems.map(item => (
                        <tr key={item.id} className="border-b">
                            <td className="py-4 px-4">
                            <div className="flex items-center">
                                <div 
                                className="w-24 h-50 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4 cursor-pointer"
                                onClick={() => handleProductClick(item)}
                                >
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="h-full w-full object-cover object-center"
                                />
                                </div>
                                <div>
                                <h3 
                                    className="font-semibold text-lg cursor-pointer hover:underline"
                                    onClick={() => handleProductClick(item)}
                                >
                                    {item.name}
                                </h3>
                                <p className="text-gray-500 mt-1">브랜드: {item.brand}</p>
                                <p className="text-gray-500">사이즈: {item.size}</p>
                                <p className="text-gray-500">상품 코드: {item.w_code}</p> 
                                <p className="text-gray-500">단가: {item.price.toLocaleString()}원</p>
                                </div>
                            </div>
                            </td>
                            <td className="text-center py-4 px-4">
                            <div className="flex items-center justify-center">
                                <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="px-2 py-1 border rounded-l"
                                >
                                -
                                </button>
                                <span className="px-4 py-1 border-t border-b">
                                {item.quantity}
                                </span>
                                <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="px-2 py-1 border rounded-r"
                                >
                                +
                                </button>
                            </div>
                            </td>
                            <td className="text-center font-semibold py-4 px-4">
                            {(item.price * item.quantity).toLocaleString()}원
                            </td>
                            <td className="text-center py-4 px-4">
                            <button 
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700"
                            >
                                삭제
                            </button>
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
            <div className="bg-white rounded-lg shadow-md">
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
                <div className="border-t pt-4">
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
                  className="w-full bg-red-500 text-white py-3 px-4 rounded-md mt-6 hover:bg-red-600 transition duration-300 text-xl font-bold"
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