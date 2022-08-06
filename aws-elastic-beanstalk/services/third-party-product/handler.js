'use strict';

module.exports.thirdPartyProduct = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      api: 'third-party-product',
      uuid: 'uuid-for-3-party-product',
      productName: 'Third Party Product Name',
      productDescription: 'ProductDescription',
    }),
  };
};
