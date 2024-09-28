import { useState, useMemo } from 'react';
import { sortProducts } from './SortUtils';

export const useProductSort = (initialProducts) => {
  const [products, setProducts] = useState(initialProducts);
  const [sortOption, setSortOption] = useState('latest');

  const sortedProducts = useMemo(() => sortProducts(products, sortOption), [products, sortOption]);

  const handleSortChange = (newSortOption) => {
    setSortOption(newSortOption);
  };

  return { sortedProducts, sortOption, handleSortChange, setProducts };
};