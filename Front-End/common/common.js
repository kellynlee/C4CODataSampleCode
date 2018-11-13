const config = require('../config/api.config');
const axios = require('axios');
export default {
    getOpenID (code) {
        return new Promise((res, rej) => {
            axios({
                method: 'post',
                url: config.url.getOpenID,
                data: {
                    code: code
                }
            }).then((data) => {
                res(data.data)
            })
        });
    }
}