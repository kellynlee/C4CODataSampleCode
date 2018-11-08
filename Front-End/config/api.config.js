const isPrd = Object.is(process.env.NODE_ENV, 'production');
const HOST = isPrd ? 'https://c4codatasample.cfapps.us10.hana.ondemand.com' : 'http://localhost:4000';
const URL = {
    createTicket: HOST + '/createTicket',
    createBP: HOST + '/createBP',
    getContactCollection: HOST + '/getContactCollection',
    wxConfig: HOST + '/wxJssdk/getJssdk',
    getTicket: HOST + '/getTicket',
    getTicketList: HOST + '/getTicketList'
}

module.exports = {
    baseUrl: isPrd ? 'https://c4codatasample.cfapps.us10.hana.ondemand.com' : 'api/',
    url: URL
}