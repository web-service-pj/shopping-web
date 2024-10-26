import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryPage from './CategoryPage';
import { useProductSort } from '../components/product/UseProductSort';
import { checkTokenExpiration } from '../utils/auth';

const MenPage = () => {
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState('all');
  const { sortedProducts, sortOption, handleSortChange, setProducts } = useProductSort([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/men-products');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const formattedProducts = data.map(product => {
          // 재고 정보 파싱 및 총 재고 계산
          const stocks = product.w_stock.split(/[;,]/).map(item => item.trim());
          const totalStock = stocks.reduce((total, stock) => {
            const [, quantity] = stock.split(':').map(item => item.trim());
            return total + (parseInt(quantity) || 0);
          }, 0);

          // 상품 정보 포맷팅
          return {
            ...product,
            image: product.w_path.split(',')[0].trim(),
            brand: product.w_brand,
            name: product.w_name,
            price: totalStock === 0 ? '품절' : `${product.w_price.toLocaleString()}원`,
            priceValue: product.w_price, // 정렬을 위한 실제 가격 값
            category: product.w_category,
            isOutOfStock: totalStock === 0,
            totalStock: totalStock,
          };
        });
        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();

    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, [setProducts]);

  const filteredProducts = useMemo(() => {
    return currentCategory === 'all'
      ? sortedProducts
      : sortedProducts.filter(product => product.category === currentCategory);
  }, [currentCategory, sortedProducts]);

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
  };

  const handleProductClick = (product) => {
    navigate(`/men/${product.w_code}`, { state: { product } });
  };

  // 품절 상태에 따른 스타일을 적용한 제품 데이터 전달
  const styledProducts = filteredProducts.map(product => ({
    ...product,
    priceClassName: product.isOutOfStock ? 'text-gray-400' : 'text-black'
  }));

  return (
    <CategoryPage 
      gender="men" 
      category={currentCategory} 
      products={styledProducts}
      onCategoryChange={handleCategoryChange}
      onSortChange={handleSortChange}
      currentSort={sortOption}
      onProductClick={handleProductClick}
    />
  );
};

export default MenPage;