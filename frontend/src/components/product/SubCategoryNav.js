import React from 'react';

const SubCategoryNav = ({ categories, onCategoryChange, currentCategory, useDynamicCategories = false }) => {
  const defaultCategories = [
    { name: '전체', path: 'all' },
    { name: '아우터', path: 'outer' },
    { name: '티셔츠', path: 't-shirts' },
    { name: '바지', path: 'pants' },
    { name: '모자', path: 'hat' },
    { name: '가방', path: 'bags' },
    { name: '신발', path: 'shoes' },
    { name: '악세사리', path: 'accessories' },
  ];

  const displayCategories = useDynamicCategories ? categories : defaultCategories;

  return (
    <nav className="w-full bg-white bg-opacity-95 border-b border-[#F3F4F6]">
      <div className="flex justify-center gap-12 h-9 items-center px-8">
        {displayCategories.map((category) => (
          <button
            key={category.path}
            onClick={() => onCategoryChange(category.path)}
            className={`text-[#1F2937] text-xs hover:text-[#4B5563] ${
              currentCategory === category.path ? 'font-bold' : ''
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default SubCategoryNav;