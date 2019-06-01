const request = require('request');

function get(url) {
  return new Promise((r, _) => {
    request(url, function (error, response, body) {
      r(body);
    });
  });
}


module.exports = {
  get
}
