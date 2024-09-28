import React from 'react';

const FilterSort = ({ onSortChange, currentSort }) => (
  <div className="flex justify-between items-center py-4 px-8">
    <div className="flex space-x-4">
      <select className="border p-2 text-sm">
        <option>필터</option>
      </select>
      <button className="text-sm">새 상품 보기</button>
    </div>
    <select 
      className="border p-2 text-sm"
      value={currentSort}
      onChange={(e) => onSortChange(e.target.value)}
    >
      <option value="latest">최신순</option>
      <option value="popular">인기순</option>
      <option value="priceAsc">가격 낮은 순</option>
      <option value="priceDesc">가격 높은 순</option>
    </select>
  </div>
);

export default FilterSort;