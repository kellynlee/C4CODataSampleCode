const tool = require('../Tools');
const rp = tool.requestPromise;
module.exports = function () {
    const rp = require('request-promise');
    var token;
    const getOption = require('./createOptionData');
    var options = getOption('GET','','',true);
    options.resolveWithFullResponse = true;
    console.log(options.headers);
    return new Promise((res,rej) => {
        rp(options).then((data) => {
            console.log(data.headers)
            res(data.headers['x-csrf-token']);
        }).catch((err) => {
            console.log(err)
        })
    })
    // return token;
}