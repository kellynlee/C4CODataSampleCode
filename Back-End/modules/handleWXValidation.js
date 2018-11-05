const signatureValidate = function (signature, timestamp, nonce) {
    let wxConfig = require('../config/wechatConfig');
    let crypto = require('crypto');
    let token = wxConfig.validationToken;
    let array = new Array(token, timestamp, nonce);
    array.sort();
    let str = array.toString().replace(/,/g,"");
    let sha1Code = crypto.createHash("sha1");
    let code = sha1Code.update(str).digest('hex');
    return new Promise((res,rej) => {
        if (code === signature) {
            res(true);
        } else {
            res(false);
        }
    });
}
exports.signatureValidate = signatureValidate;