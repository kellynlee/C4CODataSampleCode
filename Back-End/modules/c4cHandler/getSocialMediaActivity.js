const configData = require('../../config/server.config');
const rp = require('../requestPromise');
const getOption = require('./createOptionData');
const getActivityData = function (ID,ObjectID,res) {
    if(ID || ID.length>0) {
        var queryParam = configData.apiList.ServiceRequest + "?$filter=ID eq \'" + ID + "\'&$expand=ServiceRequestBusinessTransactionDocumentReference";
    } else if(ObjectID || ObjectID.length>0) {
        var queryParam = configData.apiList.ServiceRequest +"(\'"+ ObjectID +"\')"+"/ServiceRequestBusinessTransactionDocumentReference";
    }
    let options = getOption('GET', '', queryParam, false);
    rp(options).then((data) => {
        if(data.d.results[0]) {
            let ServiceRequestDoc;
            if (data.d.results[0].ServiceRequestBusinessTransactionDocumentReference) {
                ServiceRequestDoc = data.d.results[0].ServiceRequestBusinessTransactionDocumentReference;
            } else {
                ServiceRequestDoc = data.d.results;
            }
            if (ServiceRequestDoc.length > 0) {
                let SocialMedia = ServiceRequestDoc.find((elem) => (elem.TypeCode == '1607'));
                if (SocialMedia) {
                    let queryParam = configData.apiList.SMA + "?$filter=ID eq \'" + SocialMedia.ID + "\'";
                    let options = getOption('GET', '', queryParam, false);
                    rp(options).then((data) => {
                        if (data.d.results[0]) {
                            let SocialMediaActivity = data.d.results[0];
                            res(SocialMediaActivity);
                        } else {
                            res(undefined)
                        }
                    })
                } else {
                    res(undefined);
                }
            //     if (SocialMedia) {
            //         let SocialMediaID = SocialMedia.ID;
            //         ticketDetail.isOrigin = true;
            //         ticketDetail.SocialMediaActivityID = SocialMedia.ID;
            //     } else {
            //         ticketDetail.isOrigin = false;
            //     }
            //     ticketDetail.isOrigin = true;
            // } else {
            //     ticketDetail.isOrigin = false;
            } else {
                res(undefined);
            }
        } else {
            res(undefined);
        }
    })
}
module.exports = function (ID,ObjectID) {
    return new Promise((res, rej) => {
        getActivityData(ID,ObjectID,res);
    })
}