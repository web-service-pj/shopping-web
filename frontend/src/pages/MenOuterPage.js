import React from 'react';
import CategoryPage from './CategoryPage';

const menouter = () => {
  const products = [
    { image: '/OUTDOOR DOWN JACKT.jpg', brand: 'ASICS', name: 'OUTDOOR DOWN JACKT', price: '443,000원' },
    { image: '/LIGHTWEIGHT DOWN JACKET.jpg', brand: 'ASICS', name: 'LIGHTWEIGHT DOWN JACKET', price: '159,000원' },
    { image: '/LIGHTWEIGHT DOWN VEST.jpg', brand: 'ASICS', name: 'LIGHTWEIGHT DOWN VEST', price: '139,000원' },
    // 더 많은 제품을 여기에 추가할 수 있습니다.
  ];

  return <CategoryPage gender="men" category="outer" products={products} />;
};

export default menouter;