import React, { useState } from 'react';
import CategoryPage from './CategoryPage';

const Men = () => {
  const [currentCategory, setCurrentCategory] = useState('all');
  const [sortOption, setSortOption] = useState('latest');

  const allProducts = [
    { image: '/OUTDOOR DOWN JACKT.jpg', brand: 'ASICS', name: 'OUTDOOR DOWN JACKT', price: '443,000원', category: 'outer', wDate: '2023-09-15' },
    { image: '/LIGHTWEIGHT DOWN JACKET.jpg', brand: 'ASICS', name: 'LIGHTWEIGHT DOWN JACKET', price: '159,000원', category: 'outer', wDate: '2023-09-10' },
    { image: '/LIGHTWEIGHT DOWN VEST.jpg', brand: 'ASICS', name: 'LIGHTWEIGHT DOWN VEST', price: '139,000원', category: 'outer', wDate: '2023-09-05' },
    { image: '/BASIC TSHIRT.jpg', brand: 'NIKE', name: 'BASIC TSHIRT', price: '39,000원', category: 't-shirts', wDate: '2023-09-20' },
    { image: '/SLIM FIT JEANS.jpg', brand: 'LEVI\'S', name: 'SLIM FIT JEANS', price: '89,000원', category: 'pants', wDate: '2023-09-01' },
  ];

  const filteredProducts = currentCategory === 'all' 
    ? allProducts 
    : allProducts.filter(product => product.category === currentCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'latest') {
      return new Date(b.wDate) - new Date(a.wDate);
    }
    // 다른 정렬 옵션들을 여기에 추가할 수 있습니다.
    return 0;
  });

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  return (
    <CategoryPage 
      gender="men" 
      category={currentCategory} 
      products={sortedProducts} 
      onCategoryChange={handleCategoryChange}
      onSortChange={handleSortChange}
      currentSort={sortOption}
    />
  );
};

export default Men;