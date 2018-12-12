const request = require('request');

const UUIDEndoce = function (ID) {
    return ID.slice(0,8) +"-"+ ID.slice(8,12) + "-"+ ID.slice(12,16) + "-" + ID.slice(16,20) + "-" + ID.slice(20,ID.length);
}

const DateFormatter = function (date) {
    let dateObj = new Date(date);
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() < 10? '0' + dateObj.getMonth():dateObj.getMonth();
    let day = dateObj.getDate() < 10? '0' + dateObj.getDate():dateObj.getDate();
    if (dateObj.getHours() <= 12) {
        if(dateObj.getHours() < 10) {
            var hour = '0' + dateObj.getHours();
        } else {
            var hour = dateObj.getHours() + '';
        }
        var flag = 'AM';
    } else {
        if ((dateObj.getHours()-12) < 10) {
            var hour = '0' + (dateObj.getHours()-12);
        } else if (10< (dateObj.getHours()-12) < 12) {
            var hour = (dateObj.getHours()-12) + '';
        }
        var flag = 'PM'
    }
    let min = dateObj.getMinutes() < 10? '0' + dateObj.getMinutes():dateObj.getMinutes();
    // let sec = dateObj.getSeconds() < 10? '0' + date.getSeconds():dateObj.getSeconds();
    let formattedDate = month + '/' + day + '/' + year + ' ' + hour + ':' + min + flag;
    return formattedDate;
}

exports.UUIDEndoce = UUIDEndoce;
exports.DateFormatter = DateFormatter;
