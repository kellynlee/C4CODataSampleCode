module.exports = function(data, param, requireData) {
    const config = require('../../config/server.config');
    const getOption = require('./createOptionData');
    const queryParam =config.apiList.getSMUP+ "?" + param + "=\'" + data + "\'";
    const rp = require('request-promise');
    let options = getOption('GET', '', queryParam, true);
    options.json = true;
    console.log('start')
    return new Promise((res, rej) => {
        rp(options).then((data) => {
            console.log(data.d.results)
            if (data.d.results[0]) {
                res(data.d.results[0][requireData]);
            } else {
                res(false);
            }
        })
    })
}