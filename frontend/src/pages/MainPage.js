import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

const ProductGrid = () => {
  const products = [
    'R1id8i9jacm9', 'Iyn9e6383cdd', 'Vevct7d99fed', 'U8e0qyju0r4z', 'H84se23ddcfk',
    'T4z06b6h7pt0', 'Jeqk808kolkp', 'Ts1vt5jtwnjl', 'Ibhkckver3vo', 'S12vcacub9rn',
    'Iyc67yiaer1f', 'Jig1pbb2l0mc', 'H82khmui0bhv', 'Iepfbr0jxflh', 'Hrs17yf5kh80',
    'R17s2bnok6d0', 'Qec6z15eooc7', 'QxoatpeyikoiJpg', 'S4rvtggf7dpy', 'Vbkplnuuvi3l',
    'Iun67o3ygdo0', 'Tru4d2zl3cqa', 'Rhgl7j7n4oki', 'Rhitvud58to6'
  ];

  return (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', padding: '20px'}}>
      {products.map((product, index) => (
        <div key={index} className="Container" style={{width: '100%', aspectRatio: '463/601.89'}}>
          <img 
            src={`https://via.placeholder.com/463x602?text=${product}`} 
            alt={`Product ${index + 1}`} 
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </div>
      ))}
    </div>
  );
};

const MainPage = () => {
  return (
    <div className="MainPage">
      <Header />
      <main>
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
};

export default MainPage;
