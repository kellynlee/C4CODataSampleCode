const token = require('../../store/tokenStore');
const rp = require('request-promise');
module.exports = (openID) => {
    let options = {
        method: 'get',
        uri: 'https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + token.wxToken.access_token + '&openid='+ openID + '&lang=zh_CN'
    }
    return new Promise((res, rej) => {
        rp(options).then((data) => {
            res(JSON.parse(data))
        })
    })
}
