module.exports = function(data, param, requireData) {
    const config = require('../../config/server.config');
    const getOption = require('./createOptionData');
    const queryParam =config.apiList.getSMUP+ "?" + param + "=\'" + data + "\'";
    const tool = require('../Tools');
    const rp = tool.requestPromise;
    let options = getOption('GET', '', queryParam, true);
    options.json = true;
    console.log('start')
    return new Promise((res, rej) => {
        rp(options).then((data) => {
            // console.log(data.d.results)
            if (data.body.d.results[0]) {
                res(data.body.d.results[0][requireData]);
            } else {
                res(false);
            }
        })
    })
}