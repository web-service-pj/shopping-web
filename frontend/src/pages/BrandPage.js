import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/header';
import Footer from '../components/common/footer';

const BrandPage = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    // 실제로는 API에서 브랜드 목록을 가져와야 합니다.
    setBrands([
      { name: '032C', isNew: false },
      { name: 'A.D.E.D.', isNew: false },
      { name: 'AAUXX', isNew: false },
      { name: 'ACE TRUCK MFG', isNew: false },
      { name: 'ADIDAS', isNew: true },
      { name: 'AFFXWRKS', isNew: false },
      { name: 'AIME LEON DORE', isNew: false },
      { name: 'ALLTIMERS', isNew: false },
      { name: 'ALWAYS DO WHAT YOU SHOULD', isNew: false },
      { name: 'AMFM EQUIPMENT', isNew: false },
      { name: 'APOTHEKE FRAGRANCE', isNew: false },
      { name: 'APRIL', isNew: false },
      { name: 'ARC\'TERYX', isNew: true },
      { name: 'ARCHIES', isNew: false },
      { name: 'ARIES', isNew: false },
      { name: 'ASICS', isNew: true },
      // ... 더 많은 브랜드 추가
    ]);
  }, []);

  const chunkArray = (array, size) => {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

  const brandColumns = chunkArray(brands, Math.ceil(brands.length / 5));

  return (
    <div className="BrandPage">
      <Header />
      <nav className="w-full bg-white bg-opacity-95 border-b border-gray-100"></nav>
      <main className="p-5 bg-gray-50">
        <div className="flex justify-between">
          {brandColumns.map((column, columnIndex) => (
            <div key={columnIndex} className="w-1/5">
              {column.map((brand, index) => (
                <div key={index} className="mb-3 flex items-center">
                <Link
                to={`/brands/${brand.name.toLowerCase()}/products`}
                className="text-gray-800 text-sm hover:text-gray-600 flex items-center"
                >
                <span className="mr-2">☐</span>
                {brand.name}
                </Link>
                  {brand.isNew && (
                    <span className="ml-2 text-xs text-red-500 font-bold">
                      NEW
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BrandPage;