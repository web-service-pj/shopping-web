import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onClick }) => (
  <div onClick={onClick} className="cursor-pointer block mb-8 hover:opacity-75 transition-opacity">
    <img src={product.image} alt={product.name} className="w-full h-auto" />
    <div className="mt-2">
      <p className="text-sm text-gray-600">{product.brand}</p>
      <p className="text-sm">{product.name}</p>
      <p className="text-sm font-bold">{product.price}</p>
    </div>
  </div>
);

export default ProductCard;