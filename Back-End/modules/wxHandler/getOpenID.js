const tool = require('../Tools');
const rp = tool.requestPromise;
const configData = require('../../config/server.config');
module.exports = function(code) {
    console.log('once')
    return new Promise((res, rej) => {
        rp.get('https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + configData.WeChat.appID + '&secret=' + configData.WeChat.appSecret + '&code=' + code + '&grant_type=authorization_code').then((data) => {
            let result = JSON.parse(data.body);
            res(result.openid);
        })
    })
}