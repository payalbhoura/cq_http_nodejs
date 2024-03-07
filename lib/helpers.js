//helpers for various tasks
//dependencies
const config = require('../config.js');

//container for the helpers
const helpers = {};

helpers.pageConverter = (num) => {
  return [5 * num - 5, 5 * num - 1];
};

//parse object from json without throwing error
helpers.parseJsonToObject = (str) => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (err) {
    console.log(err);
    return {};
  }
};

module.exports = helpers;
