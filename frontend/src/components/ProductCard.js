import React from 'react';

const ProductCard = ({ image, brand, name, price }) => (
  <div className="mb-8">
    <img src={image} alt={name} className="w-full h-auto" />
    <div className="mt-2">
      <p className="text-sm text-gray-600">{brand}</p>
      <p className="text-sm">{name}</p>
      <p className="text-sm font-bold">{price}</p>
    </div>
  </div>
);

export default ProductCard;
