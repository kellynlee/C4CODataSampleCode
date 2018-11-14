const rp = require('request-promise');
const wxConfig = require('../../config/wechatConfig');
const serverConfig = require('../../config/server.config');
const store = require('../../store/tokenStore');
const getAccessToken = require('./getWeChatToken');
module.exports = function (url, data, templateID) {
    console.log('send msg');
    getAccessToken().then((access_token) => {
        rp({
            method: 'post',
            uri: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + access_token,
            body: {
                    touser: data.openID,
                    template_id: templateID,
                    url: wxConfig.webAuth(serverConfig.host + url),
                    data: data.data
                },
            json: true
        }).then((data) => {
            console.log(data)
        })
    })
}