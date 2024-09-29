import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ image, brand, name, price }) => (
  <Link to={`/men/${encodeURIComponent(name)}`} className="block mb-8 hover:opacity-75 transition-opacity">
    <div>
      <img src={image} alt={name} className="w-full h-auto" />
      <div className="mt-2">
        <p className="text-sm text-gray-600">{brand}</p>
        <p className="text-sm">{name}</p>
        <p className="text-sm font-bold">{price}</p>
      </div>
    </div>
  </Link>
);

export default ProductCard;