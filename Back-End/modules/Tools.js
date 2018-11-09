const UUIDEndoce = function (ID) {
    return ID.slice(0,8) +"-"+ ID.slice(8,12) + "-"+ ID.slice(12,16) + "-" + ID.slice(16,20) + "-" + ID.slice(20,ID.length);
}

exports.UUIDEndoce = UUIDEndoce;