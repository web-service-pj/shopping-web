import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import SubCategoryNav from '../components/product/SubCategoryNav';
import FilterSort from '../components/product/FilterSort';
import ProductGrid from '../components/product/ProductGrid';
import { useProductSort } from '../components/product/UseProductSort';
import { checkTokenExpiration } from '../utils/auth';

const categoryNames = {
  all: '전체',
  outer: '아우터',
  't-shirts': '티셔츠',
  pants: '바지',
  hat: '모자',
  bags: '가방',
  shoes: '신발',
  accessories: '악세사리',
};

const BrandProductPage = () => {
  const { brandName } = useParams();
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState('all');
  const [products, setProducts] = useState([]);

  const { sortedProducts, sortOption, handleSortChange, setProducts: setSortProducts } = useProductSort([]);

  const categories = useMemo(() => {
    const uniqueCategories = ['all', ...new Set(products.map(p => p.w_category))];
    return uniqueCategories.map(category => ({
      path: category,
      name: categoryNames[category] || category
    }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return currentCategory === 'all'
      ? sortedProducts
      : sortedProducts.filter(product => product.w_category === currentCategory);
  }, [currentCategory, sortedProducts]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/brand-products/${encodeURIComponent(brandName)}`);
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
        setSortProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();

    const interval = setInterval(checkTokenExpiration, 60000); // 1분마다 체크
    return () => clearInterval(interval);
  }, [brandName, setSortProducts]);

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
  };

  const handleProductClick = (product) => {
    navigate(`/brands/${encodeURIComponent(brandName)}/${product.w_code}`, { state: { product } });
  };

  return (
    <div className="BrandProductPage">
      <Header />
      <div className="text-center py-4">
        <h1 className="text-lg font-bold">{decodeURIComponent(brandName)}</h1>
      </div>
      <SubCategoryNav 
        categories={categories}
        onCategoryChange={handleCategoryChange}
        currentCategory={currentCategory}
        useDynamicCategories={true}
      />
      <FilterSort onSortChange={handleSortChange} currentSort={sortOption} />
      <ProductGrid products={filteredProducts} onProductClick={handleProductClick} />
      <Footer />
    </div>
  );
};

export default BrandProductPage;