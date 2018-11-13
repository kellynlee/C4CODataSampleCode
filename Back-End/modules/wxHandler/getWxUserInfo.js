const store = require('../../store/tokenStore');
const rp = require('request-promise');
const getAccessToken = require('./getWeChatToken');
module.exports = (openID) => {
    getAccessToken().then((access_token) => {
        let options = {
            method: 'get',
            uri: 'https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + access_token + '&openid='+ openID + '&lang=zh_CN'
        }
        return new Promise((res, rej) => {
            rp(options).then((data) => {
                res(JSON.parse(data))
            })
        })
    })
}
