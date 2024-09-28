import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-8">
    {products.map((product, index) => (
      <ProductCard key={index} {...product} />
    ))}
  </div>
);

export default ProductGrid;