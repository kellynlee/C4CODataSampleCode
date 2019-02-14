const rp = require('request-promise');
const wxConfig = require('../../config/wechatConfig');
const getAccessToken = require('./getWeChatToken');
module.exports = function (access_token, url, data, templateID, msgType) {
    console.log('send msg');
    // getAccessToken().then((access_token) => {
        switch(msgType) {
            case 'templateMsg': {
                rp({
                    method: 'post',
                    uri: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + access_token,
                    body: {
                            touser: data.openID,
                            template_id: templateID,
                            url: wxConfig.webAuth(url),
                            data: data.data
                        },
                    json: true
                }).then((data) => {
                    console.log(data)
                });
            }
            break;

            case 'textMsg': {
                rp({
                    method: 'post',
                    uri: 'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=' + access_token,
                    body: {
                            touser: data.openID,
                            msgtype:"text",
                            text: {
                                content: data.data
                            }
                        },
                    json: true
                }).then((data) => {
                    console.log(data)
                });
            }
            break;
        }
    // })
}