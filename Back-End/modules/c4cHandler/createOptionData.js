module.exports = function(method, body, param, jar) {
    var config = require('../../config/server.config');
    var headers = config.headers;
    var uri = config.proxyUrl + param;
    var options = {
        uri: uri,
        method: method,
        headers: headers,
        jar: jar
    }
    // if (jar) {
    //     options.jar = jar;
    // }
    if (method == "GET") {
        options.headers["x-csrf-token"] = "fetch";
    } else {
        options['body'] = body;
    }
    options['json'] = true;
    return options;
}