import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/header';
import Footer from '../components/common/footer';

const Banner = () => {
  return (
    <Link to="/sale" className="w-full flex justify-center bg-gradient-to-br from-gray-800 to-black cursor-pointer">
      <img 
        src="/images/trend-core-banner2.jpeg" 
        alt="TREND CORE GRAND OPEN 2024.10.01" 
        className="w-full h-auto hover:opacity-95 transition-opacity"
        style={{ width: '1920px' }}
      />
    </Link>
  );
};

const MainPage = () => {
  return (
    <div className="MainPage min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Banner />
      </main>
      <Footer />
    </div>
  );
};

export default MainPage;