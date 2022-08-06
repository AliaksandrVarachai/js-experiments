'use strict';

module.exports.product = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      api: 'product',
      id: 'product-id',
      name: 'Product Name',
      description: 'Description',
    }),
  };
};
