module.exports = function (ID, data, token) {
    const rp = require('../requestPromise');
    const configData = require('../../config/server.config');
    const getOption = require('./createOptionData');
    let queryParams = configData.apiList.ServiceRequest + "("+"\'" + ID + "\'" + ")";
    console.log(queryParams)
    let options = getOption('PATCH', data, queryParams, true);
    console.log(options.uri)
    return new Promise((res, rej) => {
        rp(options).then((data) => {
            res();
        })
    })
}