//dependencies
const fs = require('fs');
const helpers = require('./helpers.js');
const path = require('path');

//container for productDetails methods
const _productDetails = {};
//get method of productDetails
_productDetails.get = (data, callback) => {
  const { id } = data.queryStringObject;
  productsFilename = path.join(__dirname, '../data/products.json');
  //read the products file
  fs.readFile(productsFilename, 'utf-8', (err, Filedata) => {
    if (!err && Filedata) {
      const products = helpers.parseJsonToObject(Filedata);
      const product = products.find((product) => product.id === id);
      if (product) {
        callback(200, product);
      } else {
        callback(404);
      }
    } else {
      console.log(err);
      callback(500);
    }
  });
};

module.exports = _productDetails;
