module.exports = function(openID, param, requireData) {
    const config = require('../config/server.config');
    const getOption = require('../modules/createOptionData');
    const queryParam =config.apiList.getSMUP+ "?" + param + "=\'" + openID + "\'";
    const rp = require('request-promise');
    let options = getOption('GET', '', queryParam, true);
    options.json = true;
    return new Promise((res, rej) => {
        rp(options).then((data) => {
            if (data.d.results[0]) {
                res(data.d.results[0][requireData]);
            } else {
                res(false);
            }
        })
    })
}