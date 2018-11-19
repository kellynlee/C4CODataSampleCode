const tool = require('../Tools');
const rp = tool.requestPromise;
module.exports = function () {
    const request = require('request');
    var token;
    const getOption = require('./createOptionData');
    var options = getOption('GET','','',true);
    options.resolveWithFullResponse = true;
    // console.log(options.headers);
    return new Promise((res,rej) => {
        request(options, (err, response, body) => {
            console.log(response.headers)
            // console.log(response.headers['x-csrf-token'])
            res(response.headers['x-csrf-token'])
        })
    })
    // return token;
}