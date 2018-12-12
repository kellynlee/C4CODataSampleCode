const tool = require('../Tools');
const rp = require('request-promise');
const configData = require('../../config/server.config');
module.exports = function(code) {
    console.log('once')
    return new Promise((res, rej) => {
        rp.get('https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + configData.WeChat.appID + '&secret=' + configData.WeChat.appSecret + '&code=' + code + '&grant_type=authorization_code').then((data) => {
            console.log(data)
            let result = JSON.parse(data);
            res(result);
        })
    })
}