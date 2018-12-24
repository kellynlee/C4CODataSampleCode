const rp = require('../requestPromise');
const getWxUserInfo = require('../wxHandler/getWxUserInfo');
const getOption = require('../c4cHandler/createOptionData');
module.exports = function(SMUPCategoryCode, SocialMediaChannelCode, ProviderID, openID, nickName, headImageUrl, BPNode, url) {
    return new Promise((res, rej) => {
        let body = {
            SocialMediaUserCategoryCode: SMUPCategoryCode,
            SocialMediaUserProfileUserInformation: [{
                SocialMediaChannelCode: SocialMediaChannelCode,
                GivenName:nickName,
                ExternalPartyAccountID:ProviderID,
                SocialMediaUserAccountID:openID,
                SocialMediaUserName:nickName,
                SocialMediaUserImageURI:headImageUrl
            }],
            SocialMediaUserProfileBupaReference: [BPNode]
        };
        let options = getOption('POST', body, url, true);
        rp(options).then((data) => {
            if (data.d.results) {
                res(data.d.results);
            }
        })
    })
}
