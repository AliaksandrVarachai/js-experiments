'use strict';

module.exports.cart = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      api: 'cart',
      id: 'cart-product-id',
      name: 'Cart Product Name',
      description: 'Cart Product Description',
    }),
  };
};
