import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import SubCategoryNav from '../components/SubCategoryNav';
import FilterSort from '../components/FilterSort';
import ProductGrid from '../components/ProductGrid';

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