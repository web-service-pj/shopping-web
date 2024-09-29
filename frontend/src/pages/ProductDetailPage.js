import React, { useState } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ProductDetailPage = () => {
//   const { productName } = useParams();
  const [selectedSize, setSelectedSize] = useState('');

  const product = {
    brand: 'ASICS',
    name: 'OUTDOOR DOWN JACKT',
    subname: 'PERFORMANCE BLACK',
    description: '아웃도어 다운 자켓 퍼포먼스 블랙',
    code: 'AS24FWJAJH05787003',
    price: '443,000원',
    sizes: ['M', 'L', 'XL'],
    modelInfo: '키/몸무게: 183cm / 57kg',
    wearingSize: '착용 사이즈 : L',
    images: ['/OUTDOOR DOWN JACKT.jpg', '/image2.jpg', '/image3.jpg'] 
  };

  return (
    <div className="ProductDetailPage">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap -mx-4">
          {/* 이미지 슬라이더 */}
          <div className="w-full md:w-1/2 px-4 mb-8">
            <Carousel showArrows={true} showStatus={false} showThumbs={false}>
              {product.images.map((img, index) => (
                <div key={index}>
                  <img src={img} alt={`${product.name} - ${index + 1}`} />
                </div>
              ))}
            </Carousel>
          </div>

          {/* 상품 정보 */}
          <div className="w-full md:w-1/2 px-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold">{product.brand}</span>
              <button className="text-2xl">☆</button>
            </div>
            <p className="text-sm text-gray-600 mb-2">신상품</p>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <h2 className="text-xl mb-2">{product.subname}</h2>
            <p className="mb-2">{product.description}</p>
            <p className="mb-4">{product.code}</p>
            <p className="text-2xl font-bold mb-4">정상가 {product.price}</p>
            
            <div className="flex mb-4">
              {product.sizes.map(size => (
                <button 
                  key={size}
                  className={`mr-2 px-4 py-2 border ${selectedSize === size ? 'bg-black text-white' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            
            <p className="mb-2">{product.modelInfo}</p>
            <p className="mb-4">{product.wearingSize}</p>
            
            <button className="text-gray-700 mb-4 block underline hover:text-gray-900">사이즈 가이드</button>
            <button className="text-gray-700 mb-4 block underline hover:text-gray-900">상품 정보 고시</button>
            
            <button className="w-full bg-black text-white py-3 px-4 rounded mb-4">
              사이즈를 선택해주세요.
            </button>
            
            <div className="border-t pt-4">
                <details className="mb-6">
                    <summary className="font-bold cursor-pointer p-2">상세정보</summary> 
                    <p className="mt-2 p-4">ASICS는 1949년 일본에서 설립된 글로벌 스포츠 브랜드로, 고품질 운동화와 스포츠 의류를 제공합니다. "건강한 정신은 건강한 신체에서 나온다"라는 철학을 바탕으로 혁신적인 기술과 디자인을 결합하여 운동 성능을 향상시키고자 합니다. 다양한 스포츠 활동을 지원하며, 운동선수와 일반 소비자 모두에게 신뢰받는 브랜드로 자리매김하고 있습니다.</p>
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