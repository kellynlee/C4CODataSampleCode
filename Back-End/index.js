var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const history = require('connect-history-api-fallback');
const wxValidate = require('./modules/wxHandler/handleWXValidation');
const getWxToken = require('./modules/wxHandler/getWeChatToken');
const configData = require('./config/server.config');
const createMenu = require('./modules/wxHandler/createMenu');
const getOption = require('./modules/c4cHandler/createOptionData');
const getUserProfile = require('./modules/c4cHandler/getUserProfile');
const updateTicket = require('./modules/c4cHandler/updateTicket');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const getWxUserInfo = require('./modules/wxHandler/getWxUserInfo');
const getWxJSSDKToken = require('./modules/wxHandler/getWeChatJSSDkToken');
const crypto = require('crypto');
const tools = require('./modules/Tools');
const rp = require('./modules/requestPromise');
const createSMUPwithBP = require('./modules/c4cHandler/createSMUPwithBP');
const sendMsg = require('./modules/wxHandler/sendMsg');
const getOpenID = require('./modules/wxHandler/getOpenID');
const getSocialMediaActivity = require('./modules/c4cHandler/getSocialMediaActivity');
app.use(history({
  htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use(express.static(path.join(__dirname, 'views')));

app.engine('html',ejs.__express);
app.set('view engine', 'html');

getWxToken().then((access_token) => {
  createMenu(access_token);
});


app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
　next();　
});

app.get('/wx/c4c',(req, res) => {
  if(req.query.signature) {
    wxValidate.signatureValidate(req.query.signature, req.query.timestamp, req.query.nonce).then((data) => {
      console.log(data)
      if (data) {
        res.send(req.query.echostr);
      } else {
        res.send('fail')
      }
    })
  }
});


app.post('/wxJssdk/getJssdk', (req, res) => {
  getWxToken().then((access_token) => {
    getWxJSSDKToken(access_token).then((data) => {
      let jsapi_ticket = data.token;
      let nonce_str = '123456';
      let timestamp = new Date().getTime();
      let url = req.body.url;
      let str = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + nonce_str + '&timestamp=' + timestamp + '&url=' + url
      let sha1Code = crypto.createHash("sha1");
      let signature = sha1Code.update(str).digest('hex');
      console.log(req.body.url)
      console.log(configData.WeChat.appID);
      console.log(signature);
      res.send({
        appId: configData.WeChat.appID,
        timestamp: timestamp,
        nonceStr: nonce_str,
        signature: signature,
      })
    })
  });
});

// app.post('/wx/c4c', (req, res) => {
//   if(req.query.signature) {
//     wxValidate.signatureValidate(req.query.signature, req.query.timestamp, req.query.nonce).then((data) => {
//       console.log(data)
//       if (data) {
//         req.on('data', (data) => {
//           parser.parseString(data.toString(), (err, res) => {
//             let body = res.xml;
//             let msg = body.MsgType[0];
//             if(msg === "event") {
//               let event = body.Event[0];
//               if (event === "subscribe") {
//                 console.log(body.FromUserName[0]);
//                 // thiz.openID = body.FromUserName[0];
//                 getWxUserInfo(body.FromUserName[0]).then((data) => {
//                   console.log('got userinfo')
//                   let userInfo = data;
//                   let body = {
//                     SocialMediaUserCategoryCode: configData.codeCollection.SMUPCategoryCode,
//                     SocialMediaUserProfileUserInformation:[{
//                       SocialMediaChannelCode: configData.codeCollection.SocialMediaChannelCode,
//                       GivenName:userInfo.nickname,
//                       ExternalPartyAccountID:"0011",
//                       SocialMediaUserAccountID:userInfo.openid,
//                       SocialMediaUserName:userInfo.nickname,
//                       SocialMediaUserImageURI:userInfo.headimgurl
//                     }]
//                   };
//                   let options = getOption('POST', body, configData.apiList.SMUP, true);
//                   getUserProfile(userInfo.openid,'SocialMediaUserAccountID', 'ObjectID').then((data) => {
//                     if (!data) {
//                       console.log('create new')
//                       rp(options).then((data) => {
//                         console.log('success');
//                       }).catch((err) => {
//                         console.log(err)
//                       });
//                     } else {
//                       console.log('created')
//                       console.log('success');
//                     }
//                   })
//                 })
//                 return;
//               }
//             }
//           })
//         })
//       }
//     })
//   }
// });

app.post('/getOpenID', (req, res) => {
  if (req.body.code) {
    getOpenID(req.body.code).then((data) => {
      getWxUserInfo(data.openid).then((data) => {
        console.log(data)
        res.send(data);
      });
    });
  } else {
    //for local testing
    console.log('local');
    res.send({
      openid: 'oKCV91TySfSQGar2avVhBYEIvC5w',
      nickname: 'testMan',
      headimgurl: 'aaa.jpg'
    });
  }
});

app.post('/getSMUP', (req, res) => {
  console.log(req.body.openID)
  getUserProfile(req.body.openID,'SocialMediaUserAccountID', 'AccountInternalID').then((data) => {
    console.log(data)
    if(data) {
      let reg = new RegExp("([0]*)([1-9]+[0-9]+)", "g");
      let ContactID = data.replace(reg, "$2");
      let queryParam = configData.apiList.Contact + "?$filter=ContactID eq \'" + ContactID +"\'";
      let options = getOption('GET', '', queryParam, false);
      rp(options).then((data) => {
        // console.log(data);
        let contact = data.d.results[0];
        console.log(contact);
        let contactDetail = {
          Name: contact.Name,
          Phone: contact.Phone
        };
        res.send(contactDetail)
      })
    } else {
      res.send(false)
    }
  })
})

app.post('/getContactCollection',(req, res) => {
  console.log('enter');
  console.log(req.body);
  getUserProfile(req.body.openID, 'SocialMediaUserAccountID', 'ObjectID').then((SMUPNodeID) => {
    //SMUP should be created with BP together
    if (!SMUPNodeID) {
      let queryParam =configData.apiList.Contact + "?$filter=Phone eq \'*" + req.body.phone + "*\'";
      let options = getOption('GET', '', queryParam, true);
      rp(options).then((data) => {
        console.log('found contact')
        let contact = data.d.results;
        if (contact.length <= 0) {
          res.send(contact);
        } else {
          if (contact.length == 1) {
            let ObjectID = contact[0].ObjectID;
            let UUID = tools.UUIDEndoce(ObjectID);
            let  BPNode = {
              BusinessPartnerCategoryCode:"1",
              BusinessPartnerRoleCode:configData.codeCollection.roleCode,
              BusinessPartnerUUID:UUID
            };
            createSMUPwithBP(configData.codeCollection.SMUPCategoryCode,configData.codeCollection.SocialMediaChannelCode,
              req.body.openID, req.body.nickName, req.body.headImageUrl, BPNode, configData.apiList.SMUP).then((data) => {
                if (data.ObjectID) {
                  data.isCreated = true;
                  res.send(data);
                } else{
                  throw new Error;
                }
              })
          } else {
            res.status(200);
            res.send(contact)
          }
        }
      }).catch((err) => {
        console.log(err);
        res.status(400);
        res.send(err)
      });
    }
  })
});

app.post('/createBP', (req, res) => {
  console.log('start');
  getUserProfile(req.body.openID, 'SocialMediaUserAccountID', 'ObjectID').then((nodeID) => {
    let NodeID = nodeID;
    if (!NodeID) {
      let  BPNode = {
        BusinessPartnerCategoryCode:"1",
        BusinessPartnerRoleCode:"BUP001",
        BusinessPartnerUUID:req.body.UUID
      };
      createSMUPwithBP(configData.codeCollection.SMUPCategoryCode,configData.codeCollection.SocialMediaChannelCode,
        req.body.openID, req.body.nickName, req.body.headImageUrl, BPNode, configData.apiList.SMUP).then((data) => {
          if (data.ObjectID) {
            data.isCreated = true;
            res.send(data);
          } else {
            throw new Error;
          }
        }).catch((err) => {
          res.status(400);
          res.send();
        })
    } else {
      res.status(400);
      res.send();
    }
  })
});

app.post('/createTicket', (req, res) => {
  console.log('start');
  console.log(req.body);
  let ticketInfo = {
    Name: req.body.Name,
    Description: req.body.Description,
    SerialID: req.body.SerialID,
    ServicePriorityCode: req.body.ServicePriorityCode,
    RequestedFulfillmentPeriodStartDateTime: req.body.RequestedFulfillmentPeriodStartDateTime
  }
  let openID = req.body.openID;
  let authorName = req.body.nickName;
  getUserProfile(openID, 'SocialMediaUserAccountID', 'ObjectID').then((result) => {
    if (result) {
      let UUID = tools.UUIDEndoce(result);
      let body = {
        CategoryCode: configData.codeCollection.SMACategoryCode,
        SocialMediaChannelCode:configData.codeCollection.wxChannelCode,
        SocialMediaMessageID: new Date().valueOf().toString(),
        InitiatorCode: configData.codeCollection.InitiatorCode,
        SocialMediaUserProfileUUID: UUID,
        Text: req.body.Description,
        SocialMediaActivityProviderID: configData.codeCollection.providerID,
        SocialMediaMessageAuthor: authorName
      };
      let options = getOption('POST', body, configData.apiList.SMA, true);
      rp(options).then((data) => {
        console.log(data)
        let ID = data.d.results.ID;
        let queryParam = configData.apiList.ServiceRequestBusinessTransactionDocumentReference + "?$filter=ID eq \'" + ID + "\'" + "and TypeCode eq \'" + configData.codeCollection.typeCode + "\'";
        let options = getOption('GET', '', queryParam);
        options.json = true;
        console.log('start creating')
        rp(options).then((data) => {
          console.log(data);
          if (data.d.results[0]) {
            delete ticketInfo.Description;
            updateTicket(data.d.results[0].ParentObjectID, ticketInfo, result[0]);
            let options = getOption('GET', '',configData.apiList.ServiceRequestBusinessTransactionDocumentReference + "(\'" + data.d.results[0].ObjectID + "\')/ServiceRequest", false);
            options.json = true;
            rp(options).then((data) => {
              res.send(data);
              let id = data.d.results.ID;
              let url = '/TicketDetail/' + id;
              let body = {
                openID: openID,
                data: {
                  ID: {
                    value: id,
                    color: '#173177'
                  }
                }
              };
              sendMsg(url, body, configData.templateCollection.ticketNotification);
            })
          }
        }).catch((err) => {
          console.log(err)
          res.status(400);
          res.send();
        })
      }).catch((err) => {
        console.log(err)
        res.status(400);
        res.send(err);
      })
    } else {
      res.status(400);
      res.send();
    }
  });
});

app.post('/getTicketList', (req, res) => {
  console.log('enter')
  let key = req.body.key;
  let openID = req.body.openID;
  getUserProfile(openID,'SocialMediaUserAccountID', 'AccountInternalID').then((id) => {
    if(id) {
      let reg = new RegExp("([0]*)([1-9]+[0-9]+)", "g");
      let InternalID = id.replace(reg, "$2");
      let queryParam = configData.apiList.ServiceRequest + "?$filter=ReportedPartyID eq \'" + InternalID + "\'&$orderby=ServiceRequestUserLifeCycleStatusCode desc&$top=10&$skip=" + key;
      let options = getOption('GET', '', queryParam, false);
      rp(options).then((data) => {
        let list = data.d.results;
        let channelArray = [];
        list.forEach((elem) => {
          let ObjectID = elem.ObjectID;
          var getChannel = new Promise((res,rej) => {
            getSocialMediaActivity('',ObjectID).then((data) => {
              res(data);
            })
          });
          channelArray.push(getChannel);
        })
        Promise.all(channelArray).then((result) => {
          let i = 0;
          result.forEach((elem) => {
            if (elem) {
              list[i].Channel = elem.SocialMediaActivityProviderName;
            } else {
              list[i].Channel = '';
            }
            i++
          });
          res.send(list)
        });
        // res.send(list)
      })
    } else {
      console.log('no ticket')
      res.status(400);
      res.send('no data');
    }
  })
});

app.post('/getTicket',(req, res) => {
  if (req.body.ID) {
    let SocialMediaActivity = getSocialMediaActivity(req.body.ID);
    let TicketwithLocation = new Promise((res, rej) => {
      let queryParam = configData.apiList.ServiceRequest + "?$filter=ID eq \'" + req.body.ID + "\'&$expand=ServiceRequestServicePointLocation/ServiceRequestServicePointLocationAddress";
      let options = getOption('GET', '', queryParam, false);
      rp(options).then((data) => {
        if (data.d.results[0].ServiceRequestServicePointLocation.ServiceRequestServicePointLocationAddress) {
          res(data.d.results[0]);
        }
      })
    })
    Promise.all([SocialMediaActivity, TicketwithLocation]).then((result) => {
      let activity = result[0];
      let ticketDetail = result[1];
      if (ticketDetail) {
        ticketDetail.RequestedFulfillmentPeriodStartDateTime = tools.DateFormatter(ticketDetail.RequestedFulfillmentPeriodStartDateTime);
        ticketDetail.RequestedFulfillmentPeriodEndDateTime = tools.DateFormatter(ticketDetail.RequestedFulfillmentPeriodEndDateTime);
      }
      if (activity) {
        ticketDetail.RootSocialMediaActivity = activity;
        // if (activity.SocialMediaActivityProviderID == configData.codeCollection.providerID) {
        //   ticketDetail.isOrigin = true;
        // } else {
        //   ticketDetail.isOrigin = false;
        // }
        ticketDetail.isOrigin = true;
      }
      res.send(ticketDetail);
    })
  }
});

app.post('/getInteractionHistory', (req, res) => {
  console.log('enter')
  let nodeID = req.body.ObjectID;
  if (nodeID) {
    let queryParam = configData.apiList.SocialMediaActivityInteractionHistory + "?RootSocialMediaActivityNodeID=\'" + nodeID + "\'";
    let options = getOption('GET', '', queryParam, false);
    //for local testing in axp2
    // options.uri = "https://axp-cust220.dev.sapbydesign.com/sap/c4c/odata/v1/c4codataapi/GetAllChildSocialMediaActivity?RootSocialMediaActivityNodeID=%2700163E05EC341ED38FB7A26461DBF903%27"
    rp(options).then((data) => {
      if (data.d.results[0]) {
        res.send(data.d.results)
      }
    })
  }
})

app.post('/replyMsg', (req, res) => {
  if (req.body.msg) {
    let openID = req.body.openID;
    let authorName = req.body.nickName;
    let queryParam = configData.apiList.SMA + "?$filter=ID eq \'" + req.body.ID + "\'";
    let options = getOption('GET', '', queryParam, true);
    let SMUPObjectID = getUserProfile(openID, 'SocialMediaUserAccountID', 'ObjectID');
    let RootSMAUUID = new Promise((res, rej) => {
      rp(options).then((data) => {
        res(data.d.results[0].RootSocialMediaActivityUUID);
      })
    });
    Promise.all([RootSMAUUID, SMUPObjectID]).then((data) => {
      if (data[0] && data[1]) {
        let UUID = tools.UUIDEndoce(data[1])
        let body = {
          CategoryCode: configData.codeCollection.ResponseCategoryCode,
          SocialMediaChannelCode:configData.codeCollection.wxChannelCode,
          SocialMediaMessageID: new Date().valueOf().toString(),
          InitiatorCode: configData.codeCollection.InitiatorReplyCode,
          ParentSocialMediaActivityUUID: data[0],
          Text: req.body.msg,
          SocialMediaUserProfileUUID: UUID,
          SocialMediaActivityProviderID: configData.codeCollection.providerID,
          SocialMediaMessageAuthor: authorName
        };
        let queryParam = configData.apiList.SMA;
        let options = getOption('POST', body, queryParam, true);
        console.log(options);
        rp(options).then((data) => {
          if (data.d.results.ObjectID) {
            res.send();
          } else {
            res.status(400);
            res.send()
          }
        }).catch((err) => {
          res.status(400);
          res.send();
        });
      }
    })
  }
})

app.post('/wechat/c4c/reply', (req, res) => {
  let reply = JSON.parse(req.body.content);
  console.log(reply);
  let ticketID = reply.service_req_no;
  let replyMsg = {
    data: {
      Text: {
        value: reply.text,
        color: '#173177'
      },
      ID: {
        value: reply.service_req_no,
        color: '#173177'
      },
      Author: {
        value: reply.author_name,
        color: '#173177'
      }
    },
    openID: ''
  }
  let url = '/TicketDetail/' + reply.service_req_no;
  getSocialMediaActivity(ticketID).then((data) => {
    if (data) {
      let SMAID = data.ID;
      let queryParam = configData.apiList.SMA + "?$filter=ID eq \'" + SMAID + "\'";
      let options = getOption('GET', '', queryParam, false);
      rp(options).then((data) => {
        if (data.d.results[0]) {
          let SocialMediaUserProfileUUID = data.d.results[0].SocialMediaUserProfileUUID;
          if (SocialMediaUserProfileUUID) {
            let ObjectID = SocialMediaUserProfileUUID.replace(new RegExp(/-/g),'');
            console.log(ObjectID)
            let queryParam = configData.apiList.SMUP + "(\'" + ObjectID + "\')/SocialMediaUserProfileUserInformation";
            let options = getOption('GET', '', queryParam, false);
            rp(options).then((data) => {
              if (data.d.results[0]) {
                let openID = data.d.results[0].SocialMediaUserAccountID;
                console.log(openID)
                if (openID) {
                  replyMsg.openID = openID;
                  sendMsg(url, replyMsg, configData.templateCollection.socialInteractionNotification);
                  res.status(200);
                  res.send();
                }
              }
            })
          } else {
            res.status(400);
            res.send();
          }
        } else {
          res.status(400);
          res.send();
        }
      })
    } else {
      res.status(400);
      res.send();
    }
  })
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT || 4000, () => {
  console.log('server start!')
})

module.exports = app;
