import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import SubCategoryNav from '../components/product/SubCategoryNav';
import FilterSort from '../components/product/FilterSort';
import ProductGrid from '../components/product/ProductGrid';
import { useProductSort } from '../components/product/UseProductSort';

const categoryNames = {
  all: '전체',
  outer: '아우터',
  't-shirts': '티셔츠',
  pants: '바지',
  hats: '모자',
  bags: '가방',
  shoes: '신발',
  accessories: '악세사리',
};

const BrandProductPage = () => {
  const { brandName } = useParams();
  const [currentCategory, setCurrentCategory] = useState('all');
  const [products, setProducts] = useState([]);

  const { sortedProducts, sortOption, handleSortChange, setProducts: setSortProducts } = useProductSort([]);

  const categories = useMemo(() => {
    const uniqueCategories = ['all', ...new Set(products.map(p => p.category))];
    return uniqueCategories.map(category => ({
      path: category,
      name: categoryNames[category] || category
    }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return currentCategory === 'all'
      ? sortedProducts
      : sortedProducts.filter(product => product.category === currentCategory);
  }, [currentCategory, sortedProducts]);

  useEffect(() => {
    // 실제로는 API에서 브랜드별 상품과 카테고리를 가져와야 합니다.
    const fetchedProducts = [
      { image: '/product1.jpg', brand: brandName, name: 'Product 1', price: '100,000원', category: 'outer', w_date: '2023-09-15', w_volume: 100, w_price: 100000 },
      { image: '/product2.jpg', brand: brandName, name: 'Product 2', price: '150,000원', category: 't-shirts', w_date: '2023-09-10', w_volume: 150, w_price: 150000 },
      { image: '/product3.jpg', brand: brandName, name: 'Product 3', price: '80,000원', category: 'pants', w_date: '2023-09-05', w_volume: 80, w_price: 80000 },
      { image: '/product4.jpg', brand: brandName, name: 'Product 4', price: '200,000원', category: 'outer', w_date: '2023-09-01', w_volume: 200, w_price: 200000 },
      // ... 더 많은 상품 추가
    ];
    setProducts(fetchedProducts);
    setSortProducts(fetchedProducts);
    setCurrentCategory('all');
  }, [brandName, setSortProducts]);

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
  };

  return (
    <div className="BrandProductPage">
      <Header />
      <div className="border-t border-gray-100" style={{height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <h1 className="text-lg font-bold">{brandName}</h1>
      </div>
      <SubCategoryNav 
        categories={categories}
        onCategoryChange={handleCategoryChange}
        currentCategory={currentCategory}
        useDynamicCategories={true}
      />
      <FilterSort onSortChange={handleSortChange} currentSort={sortOption} />
      <ProductGrid products={filteredProducts} />
      <Footer />
    </div>
  );
};

export default BrandProductPage;