module.exports = function (ID, data, token) {
    const tool = require('../Tools');
    const rp = tool.requestPromise;
    const getToken = require('./getToken');
    const configData = require('../../config/server.config');
    const getOption = require('./createOptionData');
    let queryParams = configData.apiList.ServiceRequest + "("+"\'" + ID + "\'" + ")";
    console.log(queryParams)
    let options = getOption('PATCH', data, queryParams, true);
    console.log(options.uri)
    return new Promise((res, rej) => {
        console.log('got token')
        options.headers["x-csrf-token"] = token;
        options.json = true;
        rp(options).then((data) => {
            res(data.body);
        })
    })
}