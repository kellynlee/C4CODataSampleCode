const request = require('request');
const getToken = require('./c4cHandler/getToken');
const parserString = require('xml2js').parseString;
module.exports = function(options) {
	if (options.method == "POST") {
		return new Promise((res, rej) => {
        getToken().then((data) => {
        	console.log(options);
            options.headers['x-csrf-token'] = data;
            options.gzip = true;
                request(options,(error, response, body) => {
                    if (error) {
                        console.log(error)
                        rej()
                    } else {
                        console.log(body);
                        let result = JSON.parse(body);
                        res(result);
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