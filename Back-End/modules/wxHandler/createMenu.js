const wxConfig = require('../../config/wechatConfig');
const serverConfig = require('../../config/server.config');
const tool = require('../Tools');
const rp = tool.requestPromise;
// const rp = require('request-promise')
module.exports =  function (access_token) {
    let options = {
        method: 'post',
        uri: 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' + access_token,
        body: {
          "button":[
            {
              "name":"Contact",
              "type":"view",
              "url":wxConfig.webAuth(serverConfig.host + "/ContactCollection")
            },
            {
              "name":"Ticket",
              "sub_button":[
                {
                  "type":"view",
                  "name":"Create Ticket",
                  "url":wxConfig.webAuth(serverConfig.host + "/SocialMediaActivityCreate")
                },
                {
                  "type":"view",
                  "name":"Check List",
                  "url":wxConfig.webAuth(serverConfig.host + "/TicketList")
                }
              ]
            }
          ]
        },
        json: true
      }
      rp(options).then((data) => {
        console.log(data)
      })
}