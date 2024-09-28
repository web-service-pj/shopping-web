import React from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import SubCategoryNav from '../components/product/SubCategoryNav';
import FilterSort from '../components/product/FilterSort';
import ProductGrid from '../components/product/ProductGrid';

const CategoryPage = ({ gender, category, products, onCategoryChange, onSortChange, currentSort }) => {
  return (
    <div className="CategoryPage">
      <Header />
      <SubCategoryNav 
        gender={gender} 
        onCategoryChange={onCategoryChange} 
        currentCategory={category} 
      />
      <FilterSort onSortChange={onSortChange} currentSort={currentSort} />
      <ProductGrid products={products} />
      <Footer />
    </div>
  );
};

export default CategoryPage;