import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import { checkTokenExpiration } from '../utils/auth';

const BrandPage = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/brands');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBrands(data.map(brand => ({
          name: brand.w_brand,
          isNew: brand.isNew === 1
        })));
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchBrands();

    const interval = setInterval(checkTokenExpiration, 60000); // 1분마다 체크
    return () => clearInterval(interval);
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
      <main className="p-5 bg-gray-50 -mt-px">
        <div className="flex justify-between">
          {brandColumns.map((column, columnIndex) => (
            <div key={columnIndex} className="w-1/5">
              {column.map((brand, index) => (
                <div key={index} className="mb-3 flex items-center">
                  <Link
                    to={`/brands/${encodeURIComponent(brand.name)}/products`}
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