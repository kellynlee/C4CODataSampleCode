const proxyUrl = "https://my306768.vlab.sapbydesign.com/sap/c4c/odata/v1/c4codataapi/";

const host = 'https://c4codatasample.cfapps.us10.hana.ondemand.com';

const apiList = {
    Contact: 'ContactCollection',
    SMUP: 'SocialMediaUserProfileCollection',
    SMA: 'SocialMediaActivityCollection',
    BP: 'SocialMediaUserProfileBupaReferenceCollection',
    getSMUP: 'GetSocialMediaUserProfile',
    ServiceRequestBusinessTransactionDocumentReference: 'ServiceRequestBusinessTransactionDocumentReferenceCollection',
    ServiceRequest: 'ServiceRequestCollection',
    ServiceRequestLocation: 'ServiceRequestServicePointLocationCollection',
    SocialMediaActivityInteractionHistory: 'GetAllChildSocialMediaActivity',
    RegisteredProduct: 'RegisteredProductCollection',
    NormalProduct: 'ProductCollection'
};
const authorization = {
    Username: "Administration01",
    Password: "Welcome1"
};

const codeCollection = {
    typeCode: '1607',
    providerID:'WXOData',
    SMUPCategoryCode: '02',
    SMACategoryCode: '001',
    ResponseCategoryCode: '003',
    roleCode: 'BUP001',
    BPCategoryCode: '1',
    wxChannelCode: '008',
    SocialMediaChannelCode: '001',
    InitiatorCode: '2',
    InitiatorReplyCode: '1'
};

const templateCollection = {
    ticketNotification: '3fTc7rji2UNiCeSSmJS-8bQ2omaScofgYId4hYNKnek',
    socialInteractionNotification:'QEjMkLAwQ9ul9qUZ8LmXllp51_dzyLRJXzTzq8D9d6U',
    surveyNotification: 'Zs6DFiToLOErd9_tMn2zETXU7nDVPV9KLX-E2mBCvS8'
}


var headers = {
    'x-csrf-token': 'fetch',
    'Authorization': 'Basic ' + new Buffer(authorization.Username + ":" + authorization.Password).toString('base64'),
    'Content-Type': 'application/json',
    'Accept':'application/json'
};

const WeChat = {
    appID:'wx614510754b39bc6c',
    appSecret:'0e8aae6fa073754bb6a5c5e1091a446a'
};

module.exports = {
    proxyUrl: proxyUrl,
    host: host,
    apiList: apiList,
    authorization: authorization,
    headers: headers,
    codeCollection: codeCollection,
    WeChat: WeChat,
    templateCollection: templateCollection
};