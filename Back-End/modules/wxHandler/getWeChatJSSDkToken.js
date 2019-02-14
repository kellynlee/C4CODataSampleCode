const rp = require('request-promise');
const tokenStore = require('../../store/tokenStore');

const getToken = function (access_token) {
  return new Promise ((res, req) => {
    rp.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token + '&type=jsapi').then((data) => {
      res(JSON.parse(data));
    })
  })
};
setInterval(getToken,7100000);

module.exports = function (access_token) {
  return new Promise((res, rej) => {
    if (new Date().valueOf() > tokenStore.JSSDK["expire"]) {
      console.log('JSSDK Token refreshed in ' + new Date());
      getToken(access_token).then((data) => {
          if (data["ticket"]) {
              tokenStore.JSSDK['token'] = data["ticket"];
              tokenStore.JSSDK["expire"] = new Date().valueOf() + 7100000;
              res(tokenStore.JSSDK);
          }
      })
    } else {
        console.log(new Date() + ' , JSSDK Token is not expired')
        res(tokenStore.JSSDK);
    }
  })
}

