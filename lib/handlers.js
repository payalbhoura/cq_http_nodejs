const helpers = require('./helpers.js');
const _products = require('./products.js');
const _productDetails = require('./productDetails.js');
//Handlers
const handlers = {};
//products handler
handlers.products = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    _products[data.method](data, callback);
  } else {
    callback(405);
  }
};

//product Details Handler
handlers.productDetails = (data, callback) => {
  const acceptableMethods = ['get'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    _productDetails[data.method](data, callback);
  } else {
    callback(405);
  }
};

handlers.ping = (data, callback) => {
  callback(200);
};
//Not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};
module.exports = handlers;
