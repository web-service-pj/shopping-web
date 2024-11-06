import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3005',
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

const ProductDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeStock, setSizeStock] = useState({});
  const [isOnSale, setIsOnSale] = useState(false);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (product && product.w_size && product.w_stock) {
      const splitString = (str) => str.split(/[;,]/).map(item => item.trim());
      
      const sizes = splitString(product.w_size);
      const stocks = splitString(product.w_stock);
      
      const sizeStockObj = {};
      stocks.forEach(stock => {
        const [size, quantity] = stock.split(':').map(item => item.trim());
        sizeStockObj[size] = parseInt(quantity) || 0;
      });
      setSizeStock(sizeStockObj);

      // 세일 여부 확인 및 가격 계산
      const currentDate = new Date();
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(currentDate.getFullYear() - 2);
      
      const productDate = new Date(product.w_date);
      const isOldProduct = productDate < twoYearsAgo;
      
      setIsOnSale(isOldProduct);
      setOriginalPrice(product.w_price);
      setSalePrice(isOldProduct ? Math.floor(product.w_price * 0.5) : product.w_price);
    }
  }, [product]);

  const isOutOfStock = selectedSize && sizeStock[selectedSize] <= 0;

  const addToCart = async () => {
    if (!selectedSize) {
      alert('사이즈를 선택해주세요.');
      return;
    }

    if (isOutOfStock) {
      alert('선택하신 사이즈는 품절되었습니다.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
  
    try {
      const response = await api.post('/api/shopping-cart', {
        wearidx: product.wearidx,
        quantity: 1,
        w_code: product.w_code,
        w_gender: product.w_gender,
        size: selectedSize
      });
  
      alert(response.data.message || '장바구니에 추가되었습니다.');
    } catch (error) {
      console.error('장바구니 추가 실패:', error);
      if (error.response) {
        console.error('에러 응답:', error.response.data);
        if (error.response.status === 401) {
          alert('로그인이 필요합니다.');
          navigate('/login');
        } else if (error.response.status === 400 && error.response.data.message.includes('재고')) {
          alert('선택하신 사이즈의 재고가 부족합니다.');
        } else {
          alert(error.response.data.message || '장바구니 추가 중 오류가 발생했습니다.');
        }
      } else if (error.request) {
        console.error('요청 에러:', error.request);
        alert('서버에 연결할 수 없습니다.');
      } else {
        console.error('에러', error.message);
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const handlePurchase = () => {
    if (!selectedSize) {
      alert('사이즈를 선택해주세요.');
      return;
    }

    if (isOutOfStock) {
      alert('선택하신 사이즈는 품절되었습니다.');
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
  
    navigate('/purchase', {
      state: {
        product: {
          ...product,
          selectedSize,
          quantity: 1,
        }
      }
    });
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  const images = product.w_path.split(',').map(path => path.trim());
  const sizes = Object.keys(sizeStock);

  return (
    <div className="ProductDetailPage">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 px-4 mb-8">
            <Carousel
              showArrows={true}
              showStatus={false}
              showThumbs={false}
              infiniteLoop={true}
              centerMode={false}
              swipeable={true}
              emulateTouch={true}
            >
              {images.map((img, index) => (
                <div key={index} className="carousel-image-container">
                  <img src={img} alt={`${product.w_name} - ${index + 1}`} />
                </div>
              ))}
            </Carousel>
          </div>

          <div className="w-full md:w-1/2 px-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold">{product.w_brand}</span>
            </div>
            {isOnSale && (
              <div className="bg-red-500 text-white px-2 py-1 inline-block mb-2">
                50%
              </div>
            )}
            <h1 className="text-2xl font-bold mb-2">{product.w_name}</h1>
            <p className="mb-4">{product.w_code}</p>
            
            {isOnSale ? (
              <div className="mb-4">
                <p className="text-2xl line-through text-gray-400">
                  {`${originalPrice.toLocaleString()}원`}
                </p>
                <p className="text-2xl font-bold text-red-500">
                  {`${salePrice.toLocaleString()}원`}
                </p>
              </div>
            ) : (
              <p className="text-2xl font-bold mb-4">
                {`${originalPrice.toLocaleString()}원`}
              </p>
            )}
            
            <div className="flex mb-4">
              {sizes.map(size => (
                <button 
                  key={size}
                  className={`mr-2 px-4 py-2 border ${
                    selectedSize === size 
                      ? 'bg-black text-white' 
                      : sizeStock[size] <= 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : ''
                  }`}
                  onClick={() => sizeStock[size] > 0 && setSelectedSize(size)}
                  disabled={sizeStock[size] <= 0}
                >
                  {size}
                </button>
              ))}
            </div>

            {selectedSize && (
              <p className="mb-4">
                {isOutOfStock ? (
                  <span className="text-red-500">품절</span>
                ) : (
                  `재고: ${sizeStock[selectedSize]}`
                )}
              </p>
            )} 
            
            <p className="mb-2">키/몸무게: 183 / 57kg</p>
            <p className="mb-4">착용 사이즈: L</p>
            
            <button className="text-gray-700 mb-4 block underline hover:text-gray-900">사이즈 가이드</button>
            <button className="text-gray-700 mb-4 block underline hover:text-gray-900">상품 정보 고시</button>
            
            {selectedSize ? (
              isOutOfStock ? (
                <button 
                  className="w-full py-3 px-4 rounded text-white bg-gray-400 mb-4"
                  disabled
                >
                  품절된 상품입니다
                </button>
              ) : (
                <div className="flex space-x-4 mb-4">
                  <button 
                    className="w-1/2 py-3 px-4 rounded text-white bg-black"
                    onClick={handlePurchase}
                  >
                    구매하기
                  </button>
                  <button 
                    className="w-1/2 py-3 px-4 rounded text-black border border-black bg-white"
                    onClick={addToCart}
                  >
                    장바구니 담기
                  </button>
                </div>
              )
            ) : (
              <button 
                className="w-full py-3 px-4 rounded text-white bg-gray-400 mb-4"
              >
                사이즈를 선택하세요
              </button>
            )}
            
            <div className="border-t pt-4">
              <details className="mb-6">
                <summary className="font-bold cursor-pointer p-2">상세정보</summary> 
                <p className="mt-2 p-4">{product.w_brand}는 고품질 운동화와 스포츠 의류를 제공합니다. "건강한 정신은 건강한 신체에서 나온다"라는 철학을 바탕으로 혁신적인 기술과 디자인을 결합하여 운동 성능을 향상시키고자 합니다. 다양한 스포츠 활동을 지원하며, 운동선수와 일반 소비자 모두에게 신뢰받는 브랜드로 자리매김하고 있습니다.</p>
              </details>
              <details className="mb-6">
                <summary className="font-bold cursor-pointer p-2">배송 안내</summary>
                <div className="mt-2 p-4">
                  <p>CJ대한통운 (1588-1255) / 우체국 택배 (1588-1300)</p>
                  <p>배송 지역 : 전국 (일부 지역 제외)</p>
                  <p>배송비 : 10만원 이상 구매 시 무료 배송</p>
                  <p>배송 기간 : 평일 오후 2시 이전 결제 완료 된 주문건은 당일 출고되며 배송은 1~3일 정도 소요됩니다.</p>
                </div>
              </details>
              <details className="mb-6">
                <summary className="font-bold cursor-pointer p-2">반품 안내</summary>
                <div className="mt-2 p-4">
                  <p>CJ대한통운 (1588-1255) / 우체국 택배 (1588-1300)</p>
                  <p>반품 신청은 상품 수령 후 7일 이내 신청하시면 기사님께서 빠른 시일 내에 수거하실 예정입니다.</p>
                  <p>단순 변심으로 인한 반품 신청 시 택배비용은 고객님 부담이오니 이점 양해 바랍니다.</p>
                  <p>트렌드 코어 (마이페이지 → 주문 내역 → 주문서 상세 페이지 조회 → 반품 신청)</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;