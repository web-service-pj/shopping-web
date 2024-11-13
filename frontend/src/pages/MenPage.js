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
        const response = await fetch('http://localhost:5000/api/men-products');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // 현재 날짜 계산
        const currentDate = new Date();
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(currentDate.getFullYear() - 2);

        const formattedProducts = data.map(product => {
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

          return {
            ...product,
            image: product.w_path.split(',')[0].trim(),
            brand: product.w_brand,
            name: product.w_name,
            originalPrice: totalStock === 0 ? '품절' : `${originalPrice.toLocaleString()}원`,
            price: totalStock === 0 ? '품절' : `${salePrice.toLocaleString()}원`,
            priceValue: salePrice,
            category: product.w_category,
            isOutOfStock: totalStock === 0,
            totalStock: totalStock,
            wDate: product.w_date,
            isOnSale: isOldProduct,
            discountRate: isOldProduct ? '50%' : '',
            gender: 'M',
            priceClassName: totalStock === 0 ? 'text-gray-400' : ''
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

  return (
    <CategoryPage 
      gender="men" 
      category={currentCategory} 
      products={filteredProducts}
      onCategoryChange={handleCategoryChange}
      onSortChange={handleSortChange}
      currentSort={sortOption}
      onProductClick={handleProductClick}
    />
  );
};

export default MenPage;