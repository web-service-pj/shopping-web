export const sortProducts = (products, sortOption) => {
    return [...products].sort((a, b) => {
      switch (sortOption) {
        case 'latest':
          return new Date(b.wDate) - new Date(a.wDate);
        case 'popular':
          return b.w_volume - a.w_volume;
        case 'priceAsc':
          return parseFloat(a.price.replace(/[^0-9.-]+/g,"")) - parseFloat(b.price.replace(/[^0-9.-]+/g,""));
        case 'priceDesc':
          return parseFloat(b.price.replace(/[^0-9.-]+/g,"")) - parseFloat(a.price.replace(/[^0-9.-]+/g,""));
        default:
          return 0;
      }
    });
  };