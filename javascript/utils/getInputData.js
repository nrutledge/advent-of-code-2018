const axios = require('axios');
const { promisify } = require('util');
const fs = require('fs');
const keys = require('../config/keys');

module.exports.fromUrl = (url) => {
  options = { headers: { Cookie: keys.cookie } };
  return axios.get(url, options).then(res => res.data);
}

module.exports.fromFile = (filepath) => {
  const readFile = promisify(fs.readFile);
  return readFile(filepath, {encoding: 'utf8'});
}
