import React, { useState } from 'react';

const ProductCard = ({ product, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const images = product.image.split(',').map(path => path.trim());
  const displayImage = isHovered && images[1] ? images[1] : images[0];

  return (
    <div 
      onClick={onClick} 
      className="cursor-pointer block mb-8 transition-opacity duration-300 ease-in-out hover:opacity-75"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img src={displayImage} alt={product.name} className="w-full h-auto" />
        {product.isOnSale && (
          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-sm">
            {product.discountRate}
          </div>
        )}
      </div>
      <div className="mt-2">
        <p className="text-sm text-gray-600">{product.brand}</p>
        <p className="text-sm">{product.name}</p>
        <div className="mt-1">
          {product.isOnSale ? (
            <div className="flex items-center gap-2">
              <span className="text-sm line-through text-gray-400">
                {product.originalPrice}
              </span>
              <span className="text-sm font-bold text-red-500">
                {product.price}
              </span>
            </div>
          ) : (
            <p className={`text-sm font-bold ${product.priceClassName}`}>
              {product.price}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;