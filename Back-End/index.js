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
const getProductVerification = require('./modules/c4cHandler/ProductVerification');
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
      res.send({
        appId: configData.WeChat.appID,
        timestamp: timestamp,
        nonceStr: nonce_str,
        signature: signature,
      })
    })
  });
});

app.post('/getOpenID', (req, res) => {
  if (req.body.code) {
    getOpenID(req.body.code).then((data) => {
      getWxUserInfo(data.openid).then((data) => {
        res.send(data);
      });
    });
  } else {
    /*************************************************************************************
     * This is for local testing                                                         *
     * to simulate the data got via web page's code which generated by wechat            *
     * For more detail about wechat official account web development,                    *
     * please refer to https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1445241432 *
     * **********************************************************************************/
    console.log('local');
    res.send({
      openid: 'oKCV91TySfSQGar2avVhBYEIvC5w',
      nickname: 'testMan',
      headimgurl: 'aaa.jpg'
    });
  }
});

/*************************************************************************************
 * This function is to handle request to get Social Media User Profile               *
 * Requset: OpenID                                                                   *
 * Response: BP detail(if SMUP exist) || false(if SMUP not exist)                    *
 * **********************************************************************************/
app.post('/getSMUP', (req, res) => {
  getUserProfile(req.body.openID,'SocialMediaUserAccountID').then((SMUP) => {
    if(SMUP) {
      let reg = new RegExp("([0]*)([1-9]+[0-9]+)", "g");
      let ContactID = SMUP.AccountInternalID.replace(reg, "$2");
      let queryParam = configData.apiList.Contact + "?$filter=ContactID eq \'" + ContactID +"\'";
      let options = getOption('GET', '', queryParam, false);
      rp(options).then((data) => {
        let contact = data.d.results[0];
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

/*************************************************************************************
 * This function is to handle request to get contact via phone number                *
 * This is just one simple case to show how to filter contact via property           *
 * You can use other properties or add a SMS verification to get contact             *
 * Request: OpenID, Phone                                                            *
 * Response: BP detail(if create successfully)                                       *
 * **********************************************************************************/
app.post('/getContactCollection',(req, res, next) => {
  getUserProfile(req.body.openID, 'SocialMediaUserAccountID').then((SMUP) => {
    //SMUP should be created with BP together
    if (!SMUP) {
      let queryParam =configData.apiList.Contact + "?$filter=Phone eq \'*" + req.body.phone + "*\'";
      let options = getOption('GET', '', queryParam, true);
      rp(options).then((data) => {
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
            createSMUPwithBP(configData.codeCollection.SMUPCategoryCode,configData.codeCollection.wxChannelCode,
              configData.codeCollection.providerID, req.body.openID, req.body.nickName, req.body.headImageUrl, BPNode, configData.apiList.SMUP).then((data) => {
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
        err.status = 400;
        next(err);
      });
    }
  })
});

app.post('/createBP', (req, res, next) => {
  getUserProfile(req.body.openID, 'SocialMediaUserAccountID').then((SMUP) => {
    if (!SMUP) {
      let  BPNode = {
        BusinessPartnerCategoryCode:"1",
        BusinessPartnerRoleCode:"BUP001",
        BusinessPartnerUUID:req.body.UUID
      };
      createSMUPwithBP(configData.codeCollection.SMUPCategoryCode,configData.codeCollection.wxChannelCode,
        req.body.openID, req.body.nickName, req.body.headImageUrl, BPNode, configData.apiList.SMUP).then((data) => {
          if (data.ObjectID) {
            data.isCreated = true;
            res.send(data);
          } else {
            throw new Error;
          }
        })
    } else {
      throw new Error;
    }
  }).catch((err) => {
    err.status = 400;
    next(err);
  })
});

/******************************************************************************************
 * This function is to handle request to get registeres product's ProductID via Serial ID *
 * Request: OpenID, SerialID                                                              *
 * Response: ProductID                                                                    *
 * ****************************************************************************************/
app.post('/getRegisteredProduct', (req, res, next) => {
  let SerialID = req.body.SerialID.toUpperCase();
  let openID = req.body.openID;
  getUserProfile(openID, 'SocialMediaUserAccountID').then((SMUP) => {
    if (SMUP) {
      let reg = new RegExp("([0]*)([1-9]+[0-9]+)", "g");
      let contactID = SMUP.AccountInternalID.replace(reg, "$2");
      return contactID;
    } else {
      throw new Error('Please bind contact first!');
    }
  })
  .then((contactID) => {
    return getProductVerification(SerialID, '', contactID);
  })
  .then((data) => {
    res.send(data)
  })
  .catch((err) => {
    next(err);
  })
});

/******************************************************************************************
 * This function is to handle request to create SMA with ticket and send successful msg   *
 * Request: OpenID, Tickt Information                                                     *
 * Response: Success msg                                                                  *
 * ****************************************************************************************/
app.post('/createTicket', (req, res, next) => {
  let objectID;
  let ticketInfo = {
    Name: req.body.Name,
    Description: req.body.Description,
    SerialID: req.body.SerialID,
    ProductID: req.body.ProductID,
    ServicePriorityCode: req.body.ServicePriorityCode,
    RequestedFulfillmentPeriodStartDateTime: req.body.RequestedFulfillmentPeriodStartDateTime,
    RequestedFulfillmentPeriodStarttimeZoneCode: "GMT"
  }
  let openID = req.body.openID;
  let authorName = req.body.nickName;
  getUserProfile(openID, 'SocialMediaUserAccountID').then((SMUP) => {
    if (SMUP) {
      let reg = new RegExp("([0]*)([1-9]+[0-9]+)", "g");
      objectID = SMUP.ObjectID;
      let contactID = SMUP.AccountInternalID.replace(reg, "$2");
      return contactID;
    } else {
      throw new Error('Please bind contact first!');
    }
  })
  .then((contactID) => {
    return getProductVerification(ticketInfo.SerialID, ticketInfo.ProductID, contactID);
  })
  .then((isProduct) => {
    if(isProduct) {
      let UUID = tools.UUIDEndoce(objectID);
      let body = {
        CategoryCode: configData.codeCollection.SMACategoryCode,
        SocialMediaChannelCode:configData.codeCollection.wxChannelCode,
        SocialMediaMessageID: new Date().valueOf().toString(),
        InitiatorCode: configData.codeCollection.InitiatorCode,
        // PrivateSocialMediaMessageIndicator: true,
        SocialMediaUserProfileUUID: UUID,
        Text: req.body.Description,
        SocialMediaActivityProviderID: configData.codeCollection.providerID,
        SocialMediaMessageAuthor: authorName
      };
      let options = getOption('POST', body, configData.apiList.SMA, true);
      return options;
    } else {
      throw new Error('Not found')
    }
  })
  .then((options) => {
    rp(options).then((data) => {
      let ID = data.d.results.ID;
      let queryParam = configData.apiList.ServiceRequestBusinessTransactionDocumentReference + "?$filter=ID eq \'" + ID + "\'" + "and TypeCode eq \'" + configData.codeCollection.typeCode + "\'";
      let options = getOption('GET', '', queryParam);
      options.json = true;
      return options;
    })
    .then((options) => {
      rp(options).then((data) => {
        if (data.d.results[0]) {
          delete ticketInfo.Description;
          updateTicket(data.d.results[0].ParentObjectID, ticketInfo);
          let options = getOption('GET', '',configData.apiList.ServiceRequestBusinessTransactionDocumentReference + "(\'" + data.d.results[0].ObjectID + "\')/ServiceRequest", false);
          options.json = true;
          return options;
        } else {
          throw new Error;
        }
      })
      .then((options) => {
        rp(options).then((data) => {
          res.send(data);
          let id = data.d.results.ID;
          let url =configData.host + '/TicketDetail/' + id;
          let body = {
            openID: openID,
            data: {
              ID: {
                value: id,
                color: '#173177'
              }
            }
          };
          sendMsg(url, body, configData.templateCollection.ticketNotification, 'templateMsg');
        })
      })
    })
  }).catch((err) => {
    err.status = 404;
    next(err);
  })
});

/******************************************************************************************
 * This function is to handle request get ticket list                                     *
 * Request: OpenID                                                                        *
 * Response: Ticket List Array                                                            *
 * ****************************************************************************************/
app.post('/getTicketList', (req, res, next) => {
  let key = req.body.key;
  let openID = req.body.openID;
  getUserProfile(openID,'SocialMediaUserAccountID', 'AccountInternalID').then((SMUP) => {
    if(SMUP) {
      let reg = new RegExp("([0]*)([1-9]+[0-9]+)", "g");
      let InternalID = SMUP.AccountInternalID.replace(reg, "$2");
      let queryParam = configData.apiList.ServiceRequest + "?$filter=ReportedPartyID eq \'" + InternalID + "\'&$orderby=ServiceRequestUserLifeCycleStatusCode asc&$top=10&$skip=" + key;
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
      throw new Error;
    }
  }).catch((err) => {
    next(err);
  })
});

/******************************************************************************************
 * This function is to handle request to get single ticket's detail                       *
 * Request: OpenID, Tickt ID                                                              *
 * Response: Ticket Detail                                                                *
 * ****************************************************************************************/
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
        if (ticketDetail.RequestedFulfillmentPeriodStartDateTime.length != 0) {
          ticketDetail.RequestedFulfillmentPeriodStartDateTime = tools.DateFormatter(ticketDetail.RequestedFulfillmentPeriodStartDateTime);
        }
        ticketDetail.RequestedFulfillmentPeriodEndDateTime = tools.DateFormatter(ticketDetail.RequestedFulfillmentPeriodEndDateTime);
      }
      if (activity) {
        ticketDetail.RootSocialMediaActivity = activity;
        if (activity.SocialMediaActivityProviderID == configData.codeCollection.providerID) {
          ticketDetail.isOrigin = true;
        } else {
          ticketDetail.isOrigin = false;
        }
        ticketDetail.Description = activity.Text
        ticketDetail.isOrigin = true;
      }
      res.send(ticketDetail);
    })
  }
});

/************************************************************************************************
 * This function is to handle request to get all Social Interactions associated with the ticket *
 * Request: OpenID, Tickt ID                                                                    *
 * Response: Social Interaction Array                                                           *
 * **********************************************************************************************/
app.post('/getInteractionHistory', (req, res) => {
  let nodeID = req.body.ObjectID;
  if (nodeID) {
    let queryParam = configData.apiList.SocialMediaActivityInteractionHistory + "?RootSocialMediaActivityNodeID=\'" + nodeID + "\'";
    let options = getOption('GET', '', queryParam, false);
    //for local testing in axp2
    // options.uri = "https://axp-cust220.dev.sapbydesign.com/sap/c4c/odata/v1/c4codataapi/GetAllChildSocialMediaActivity?RootSocialMediaActivityNodeID=%2700163E05EC341ED38FB7A26461DBF903%27"
    rp(options).then((data) => {
      if (data.d.results[0]) {
        let interactions = data.d.results;
        if (interactions.length>1) {
          interactions.sort((a,b)=>{
            return a.SocialMediaMessageCreationDateTime > b.SocialMediaMessageCreationDateTime
          });
        }
        res.send(interactions)
      }
    })
  }
})

/******************************************************************************************
 * This function is to handle request to send msg to c4c                                  *
 * Request: OpenID, WeChat's nickname, message                                            *
 * Response: success msg                                                                  *
 * ****************************************************************************************/
app.post('/replyMsg', (req, res, next) => {
  if (req.body.msg) {
    let openID = req.body.openID;
    let authorName = req.body.nickName;
    let queryParam = configData.apiList.SMA + "?$filter=ID eq \'" + req.body.ID + "\'";
    let options = getOption('GET', '', queryParam, true);
    let SMUP = getUserProfile(openID, 'SocialMediaUserAccountID');
    let RootSMAUUID = new Promise((res, rej) => {
      rp(options).then((data) => {
        res(data.d.results[0].RootSocialMediaActivityUUID);
      })
    });
    Promise.all([RootSMAUUID, SMUP]).then((data) => {
      if (data[0] && data[1]) {
        let UUID = tools.UUIDEndoce(data[1].ObjectID)
        let body = {
          CategoryCode: configData.codeCollection.ResponseCategoryCode,
          SocialMediaChannelCode:configData.codeCollection.wxChannelCode,
          SocialMediaMessageID: new Date().valueOf().toString(),
          InitiatorCode: configData.codeCollection.InitiatorCode,
          ParentSocialMediaActivityUUID: data[0],
          Text: req.body.msg,
          SocialMediaUserProfileUUID: UUID,
          // PrivateSocialMediaMessageIndicator: true,
          SocialMediaActivityProviderID: configData.codeCollection.providerID,
          SocialMediaMessageAuthor: authorName
        };
        let queryParam = configData.apiList.SMA;
        let options = getOption('POST', body, queryParam, true);
        rp(options).then((data) => {
          if (data.d.results.ObjectID) {
            res.send();
          } else {
            throw new Error
          }
        })
      }
    }).catch((err) => {
      next(err)
    })
  }
})


/******************************************************************************************
 * This function is to handle request from c4c mashup service                             *
 * Case 1: Send Survey to WeChat                                                          *
 * Case 2: Send ticket reply to WeChat                                                    *
 * ****************************************************************************************/
app.post('/wechat/c4c', (req, res, next) => {
  console.log(req.body);
  let requestData;
  if (req.body.content) {
    if (JSON.parse(req.body.content)) {
      requestData = JSON.parse(req.body.content);
    }
  } else {
    requestData = req.body;
  }
  if (requestData.type == 'WKF') { //Survey Message Handle Case
    let reg = /#SURVEY[\s\S]*#/;
    let surveyData = requestData.data;
    if (surveyData.length > 0) {
      // getWxToken().then((access_token) => {
        surveyData.forEach((elem) => {
          let replyMsg = {
            data: '',
            openID: ''
          }
          let fullText = elem.fullText;
          let surveyLink = "<a href=\'" + elem.surveyLink + "\'>Survey</a>";
          replyMsg.openID = elem.openId;
          if (elem.surveyLink.length > 0) {
          let isSurvey = fullText.match(reg);
            if (isSurvey) {
              replyMsg.data = fullText.replace(reg, surveyLink);
            } else {
              replyMsg.data = fullText;
            }
          } else {
            replyMsg.data = fullText;
          }
            sendMsg('', replyMsg, '', 'textMsg');
        });
      // });
    }
    res.send();
  } else {  //Ticket Reply Handle Case
    let reply = requestData;
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
    let url = configData.host + '/TicketDetail/' + reply.service_req_no;
    let queryParam = configData.apiList.ServiceRequest + "?$filter=ID eq \'" + ticketID + "\'";
    let options = getOption('GET', '', queryParam, false);
    rp(options).then((data) => {
      if (data.d.results[0]) {
        let contactID = data.d.results[0].BuyerMainContactPartyID;
        let queryParam = "GetSocialMediaUserProfile?BusinessPartnerInternalID=" + "\'" + contactID + "\'&ExternalPartyAccountID=" + "\'" + configData.codeCollection.providerID + "\'";
        let options = getOption('GET', '', queryParam, false);
        return rp(options);
      } else {
        throw new Error;
      }
    })
    .then((data)=> {
      if(data.d.results[0]) {
        let SMUPArr = data.d.results;
        let SMUPSubNodes = [];
        SMUPArr.forEach((SMUP) => {
          let queryParam = configData.apiList.SMUP + "(\'" + SMUP.ObjectID + "\')/SocialMediaUserProfileUserInformation";
          let options = getOption('GET', '', queryParam, false);
          SMUPSubNodes.push(rp(options));
        });
        return Promise.all(SMUPSubNodes);
      } else {
        throw new Error;
      }
    })
    .then((data) => {
      if (data.length > 0) {
        let errStack = 0;
        data.forEach((elem) => {
          if (elem.d.results[0]) {
            let infoNode = elem.d.results[0];
            let openID = infoNode.SocialMediaUserAccountID;
            if (openID) {
              replyMsg.openID = openID;
              sendMsg(url, replyMsg, configData.templateCollection.socialInteractionNotification, 'templateMsg');
            }
          } else {
            errStack++;
          }
        });
        if (errStack == 0) {
          res.status(200);
          res.send();
        } else {
          throw new Error;
        }
      } else {
        throw new Error;
      }
    }).catch((err) => {
      next(err);
    })
  }
});

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
  res.status(err.status || 500).send(err.message);
});

app.listen(process.env.PORT || 4000, () => {
  console.log('server start!')
})

module.exports = app;
