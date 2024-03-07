//dependencies
const fs = require('fs');
const helpers = require('./helpers.js');
const path = require('path');

//container for products methods
const _products = {};
const productsFilename = path.join(__dirname, '../data/products.json');

//get method of products
_products.get = (data, callback) => {
  //read the products file
  fs.readFile(productsFilename, 'utf-8', (err, Filedata) => {
    if (!err && Filedata) {
      const { count } = data.queryStringObject;
      const [lowerLimit, upperLimit] = helpers.pageConverter(count);
      const products = helpers.parseJsonToObject(Filedata);
      const productsToReturn = products
        .slice(lowerLimit, upperLimit)
        .map((product) => {
          return {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
          };
        });
      callback(200, productsToReturn);
    } else {
      console.log(err);
      callback(500);
    }
  });
};

//route to delete the product(delete method)
_products.delete = (data, callback) => {
  const { id } = data.queryStringObject;
  if (id) {
    fs.readFile(productsFilename, 'utf-8', (err, Filedata) => {
      if (!err && Filedata) {
        let products = helpers.parseJsonToObject(Filedata);
        const productToDelete = products.find((product) => product.id === id);
        if (productToDelete) {
          products = products.filter((product) => product.id !== id);
          fs.writeFile(
            productsFilename,
            JSON.stringify(products),
            (err, data) => {
              if (!err) {
                callback(200);
              } else {
                console.log(err);
                callback(500, { Error: 'Could not delete the product' });
              }
            },
          );
        } else {
          callback(400, { Error: 'Could not find the product' });
        }
      } else {
        console.log(err);
        callback(500, { Error: 'Could not read the products file' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required fields' });
  }
};

//update the product(put method)
_products.put = (data, callback) => {
  const { id, name, price, image } = data.payload;
  if (id && (name || price || image)) {
    fs.readFile(productsFilename, 'utf-8', (err, Filedata) => {
      if (!err && Filedata) {
        let products = helpers.parseJsonToObject(Filedata);
        const productToUpdate = products.find((product) => product.id === id);
        if (productToUpdate) {
          if (name) {
            productToUpdate.name = name;
          }
          if (price) {
            productToUpdate.price = price;
          }
          if (image) {
            productToUpdate.image = image;
          }
          fs.writeFile(
            productsFilename,
            JSON.stringify(products),
            (err, data) => {
              if (!err) {
                callback(200);
              } else {
                console.log(err);
                callback(500, { Error: 'Could not update the product' });
              }
            },
          );
        } else {
          callback(400, { Error: 'Could not find the product' });
        }
      } else {
        console.log(err);
        callback(500, { Error: 'Could not read the products file' });
      }
    });
  } else {
    callback(400, { Error: 'Missing required fields' });
  }
};

module.exports = _products;
