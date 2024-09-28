import React, { useState, useEffect, useMemo } from 'react';
import CategoryPage from './CategoryPage';
import { useProductSort } from '../components/product/UseProductSort';

const initialProducts = [
  { image: '/OUTDOOR DOWN JACKT.jpg', brand: 'ASICS', name: 'OUTDOOR DOWN JACKT', price: '443,000원', category: 'outer', wDate: '2023-09-15', w_volume: 100 },
  { image: '/LIGHTWEIGHT DOWN JACKET.jpg', brand: 'ASICS', name: 'LIGHTWEIGHT DOWN JACKET', price: '159,000원', category: 'outer', wDate: '2023-09-10', w_volume: 150 },
  { image: '/LIGHTWEIGHT DOWN VEST.jpg', brand: 'ASICS', name: 'LIGHTWEIGHT DOWN VEST', price: '139,000원', category: 'outer', wDate: '2023-09-05', w_volume: 80 },
  { image: '/BASIC TSHIRT.jpg', brand: 'NIKE', name: 'BASIC TSHIRT', price: '39,000원', category: 't-shirts', wDate: '2023-09-20', w_volume: 200 },
  { image: '/SLIM FIT JEANS.jpg', brand: 'LEVI\'S', name: 'SLIM FIT JEANS', price: '89,000원', category: 'pants', wDate: '2023-09-01', w_volume: 120 },
];

const WomenPage = () => {
  const [currentCategory, setCurrentCategory] = useState('all');
  const allProducts = useMemo(() => initialProducts, []);

  const { sortedProducts, sortOption, handleSortChange, setProducts } = useProductSort(allProducts);

  const filteredProducts = useMemo(() => {
    return currentCategory === 'all'
      ? sortedProducts
      : sortedProducts.filter(product => product.category === currentCategory);
  }, [currentCategory, sortedProducts]);

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
  };

  useEffect(() => {
    setProducts(allProducts);
  }, [setProducts, allProducts]);

  return (
    <CategoryPage 
      gender="women" 
      category={currentCategory} 
      products={filteredProducts} 
      onCategoryChange={handleCategoryChange}
      onSortChange={handleSortChange}
      currentSort={sortOption}
    />
  );
};

export default WomenPage;