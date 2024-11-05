import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryPage from './CategoryPage';
import { useProductSort } from '../components/product/UseProductSort';
import { checkTokenExpiration } from '../utils/auth';

const SalePage = () => {
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState('all');
  const { sortedProducts, sortOption, handleSortChange, setProducts } = useProductSort([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 남성과 여성 제품 모두 가져오기
        const [menResponse, womenResponse] = await Promise.all([
          fetch('http://localhost:5000/api/men-products'),
          fetch('http://localhost:5000/api/women-products')
        ]);

        if (!menResponse.ok || !womenResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const menData = await menResponse.json();
        const womenData = await womenResponse.json();
        const allProducts = [...menData, ...womenData];

        // 현재 날짜 계산
        const currentDate = new Date();
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(currentDate.getFullYear() - 2);

        const formattedProducts = allProducts
          .map(product => {
            // 재고 정보 파싱 및 총 재고 계산
            const stocks = product.w_stock.split(/[;,]/).map(item => item.trim());
            const totalStock = stocks.reduce((total, stock) => {
              const [, quantity] = stock.split(':').map(item => item.trim());
              return total + (parseInt(quantity) || 0);
            }, 0);

            const productDate = new Date(product.w_date);
            const isOldProduct = productDate < twoYearsAgo;
            const originalPrice = product.w_price;
            const salePrice = isOldProduct ? Math.floor(originalPrice * 0.5) : originalPrice;

            // 상품 정보 포맷팅
            return {
              ...product,
              image: product.w_path.split(',')[0].trim(),
              brand: product.w_brand,
              name: product.w_name,
              price: totalStock === 0 ? '품절' : `${salePrice.toLocaleString()}원`,
              originalPrice: `${originalPrice.toLocaleString()}원`,
              priceValue: salePrice, // 정렬을 위한 실제 가격 값
              category: product.w_category,
              gender: product.gender, // 성별 정보 추가
              isOutOfStock: totalStock === 0,
              totalStock: totalStock,
              wDate: product.w_date,
              isOnSale: isOldProduct,
              discountRate: isOldProduct ? '50%' : '',
              priceClassName: totalStock === 0 ? 'text-gray-400' : isOldProduct ? 'text-red-500' : ''
            };
          })
          // 2년 이상 된 제품만 필터링
          .filter(product => product.isOnSale);

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
    const gender = product.gender === 'M' ? 'men' : 'women';
    navigate(`/${gender}/${product.w_code}`, { state: { product } });
  };

  return (
    <CategoryPage 
      gender="sale"
      category={currentCategory} 
      products={filteredProducts}
      onCategoryChange={handleCategoryChange}
      onSortChange={handleSortChange}
      currentSort={sortOption}
      onProductClick={handleProductClick}
    />
  );
};

export default SalePage;