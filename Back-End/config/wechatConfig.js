const webAuthRedirectUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx614510754b39bc6c&redirect_uri=";
const validationToken = 'test-for-token';
const webAuth = function(url) {
    return webAuthRedirectUrl + encodeURIComponent(url) + "&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect"
}

module.exports = {
    webAuth: webAuth,
    validationToken: validationToken
}