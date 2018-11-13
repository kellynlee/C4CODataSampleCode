const rp = require('request-promise');
const tokenStore = require('../../store/tokenStore');
const configData = require('../../config/server.config');
// const wx = require('http://res.wx.qq.com/open/js/jweixin-1.2.0.js');
const getToken = function () {
    let options = {
        uri: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + configData.WeChat.appID + '&secret=' + configData.WeChat.appSecret,
        methods: 'get'
    }
    return new Promise ((res, req) => {
        console.log('get token');
        rp(options).then((data) => {
            res(JSON.parse(data))
        })
    })
};
setInterval(getToken,5400000);

module.exports = function () {
    return new Promise((res, rej) => {
        if (new Date().valueOf() > tokenStore.wxToken["expire"]) {
            console.log(tokenStore.wxToken)
            getToken().then((data) => {
                if (data["access_token"]) {
                    tokenStore.wxToken["access_token"] = data["access_token"];
                    tokenStore.wxToken["expire"] = new Date().valueOf() + 7200000;
                    res(tokenStore.wxToken);
                }
            })
        } else {
            console.log('not expired')
            res(tokenStore.wxToken["access_token"]);
        }
    })
}
