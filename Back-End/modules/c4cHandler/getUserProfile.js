const config = require('../../config/server.config');
const getOption = require('./createOptionData');
const rp = require('../requestPromise');

module.exports = function(data, param, requireData) {
    let queryParam =config.apiList.getSMUP+ "?" + param + "=\'" + data + "\'";
    let options = getOption('GET', '', queryParam, true);
    options.json = true;
    console.log('user profile')
    return new Promise((res, rej) => {
        rp(options).then((data) => {
            console.log('data.d.results')
            if (data.d.results[0]) {
                res(data.d.results[0][requireData]);
            } else {
                res(false);
            }
        })
    })
}