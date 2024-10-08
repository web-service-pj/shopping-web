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
        const response = await fetch('http://113.198.66.75:13070/api/men-products');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const formattedProducts = data.map(product => ({
          ...product,
          image: product.w_path.split(',')[0].trim(),
          brand: product.w_brand,
          name: product.w_name,
          price: `${product.w_price.toLocaleString()}원`,
          category: product.w_category,
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();

    const interval = setInterval(checkTokenExpiration, 60000); // 1분마다 체크
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