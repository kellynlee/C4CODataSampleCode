const request = require('request');
const getToken = require('./c4cHandler/getToken');

module.exports = function(options) {
	if (options.method == "POST") {
		return new Promise((res, rej) => {
        getToken().then((data) => {
        	console.log(options);
            options.headers['x-csrf-token'] = data;
              request(options,(error, response, body) => {
                  if (error) {
                      rej()
                  } else {
                      res(body);
                  }
              })
          })
      })
    } else {
        return new Promise((res, rej) => {
        	options.json = true;
            request(options,(error, response, body) => {
                if (error) {
                    rej()
                } else {
                    res(body);
                }
            })
        })
    }
}