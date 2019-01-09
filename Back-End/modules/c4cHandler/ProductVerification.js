const rp = require('../requestPromise');
const configData = require('../../config/server.config');
const getOption = require('./createOptionData');
module.exports = function(SerialID, ProductID, Contact) {
    return new Promise((res, rej) => {
        let queryParam;
        if (SerialID.length == 0 && ProductID.length == 0) {
            res(true);
        } else {
            if (SerialID.length > 0) {
                queryParam = configData.apiList.RegisteredProduct + "?$filter=SerialID eq \'" + SerialID + "\'&$expand=RegisteredProductPartyInformation";
            } else {
                queryParam = configData.apiList.NormalProduct + "?$filter=ProductID eq \'" + ProductID + "\'";
            }
            let options = getOption('GET','',queryParam,false);
            rp(options).then((data) => {
                if (data.d.results[0]) {
                    let productInfo = data.d.results[0];
                    if (SerialID.length > 0) {
                        let PartyInfo = productInfo.RegisteredProductPartyInformation;
                        let contactParty = PartyInfo.find((elem) => {return elem.ContactPartyID;});
                        if (contactParty) {
                            if (contactParty.ContactPartyID === Contact) {
                                if (ProductID.length == 0) {
                                    res(productInfo.ProductID);
                                } else {
                                    if (ProductID === productInfo.ProductID) {
                                        res(true)
                                    } else {
                                        rej(new Error('SerialID and ProductID don\'t match'))
                                    }
                                }
                            } else {
                                rej(new Error('No Authorization'))
                            }
                        } else {
                            rej(new Error());
                        }
                    } else {
                        res(true)
                    }
                } else {
                    rej(new Error('Product not found'))
                }
            })
        }
    })
}