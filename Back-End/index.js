var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const history = require('connect-history-api-fallback');
const wxValidate = require('./modules/handleWXValidation');
const getWxToken = require('./modules/getWeChatToken');
const configData = require('./config/server.config');
const createMenu = require('./modules/createMenu');
const getOption = require('./modules/createOptionData');
const rp = require('request-promise');
const getUserProfile = require('./modules/getUserProfile');
const updateTicket = require('./modules/updateTicket');
const getToken = require('./modules/getToken');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const store = require('./store/tokenStore');
const getWxUserInfo = require('./modules/wxHandler/getWxUserInfo');
const getWxJSSDKToken = require('./modules/getWeChatJSSDkToken');
const crypto = require('crypto');
const tools = require('./modules/Tools');
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

getWxToken(configData.WeChat.appID, configData.WeChat.appSecret).then((data) => {
  createMenu(data.access_token);
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
  console.log(req.query.page)
  if(req.query.page) {
    res.redirect("/" + req.query.page)
  }
});

app.get('/wx/get_access_token', (req, res) => {
  console.log(req.query.page);
  if (req.query.page) {
    res.redirect("/" + req.query.page)
  }
});

app.post('/wxJssdk/getJssdk', (req, res) => {
  getWxToken(configData.WeChat.appID, configData.WeChat.appSecret).then((data) => {
    getWxJSSDKToken(data.access_token).then((data) => {
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

app.post('/wx/c4c', (req, res) => {
  var thiz = this;
  if(req.query.signature) {
    wxValidate.signatureValidate(req.query.signature, req.query.timestamp, req.query.nonce).then((data) => {
      console.log(data)
      if (data) {
        req.on('data', (data) => {
          parser.parseString(data.toString(), (err, res) => {
            let body = res.xml;
            let msg = body.MsgType[0];
            if(msg === "event") {
              let event = body.Event[0];
              if (event === "subscribe") {
                console.log(body.FromUserName[0]);
                // thiz.openID = body.FromUserName[0];
                getWxUserInfo(body.FromUserName[0]).then((data) => {
                  console.log('got userinfo')
                  let userInfo = data;
                  let body = {
                    "SocialMediaUserCategoryCode": configData.codeCollection.SMUPCategoryCode,
                    "SocialMediaUserProfileUserInformation":[{
                      "SocialMediaChannelCode": configData.codeCollection.SocialMediaChannelCode,
                      "GivenName":userInfo.nickname,
                      "ExternalPartyAccountID":"0011",
                      "SocialMediaUserAccountID":userInfo.openid
                    }]
                  };
                  let options = getOption('POST', body, configData.apiList.SMUP, true);
                  getUserProfile(userInfo.openid,'SocialMediaUserAccountID', 'ObjectID').then((data) => {
                    if (!data) {
                      console.log('create new')
                      getToken().then((data) => {
                        console.log('gotToken')
                        options.headers['x-csrf-token'] = data;
                        options.json = true;
                        rp(options).then((data) => {
                          console.log('success');
                        }).catch((err) => {
                          console.log(err)
                        });
                      }).catch((err) => {
                        console.log('err1')
                      })
                    } else {
                      console.log('created')
                      store.SocialMediaUserProfileNodeID = data;
                      store.openID = userInfo.openid;
                      console.log('success');
                    }
                  })
                })
                return;
              }
            }
          })
        })
      }
    })
  }
})

app.post('/getContactCollection',(req, res) => {
  console.log('enter');
  console.log(req.body);
  let queryParam =configData.apiList.Contact + "?$format=json&$filter=Phone eq \'*" + req.body.phone + "*\'";
  let options = getOption('GET', '', queryParam, true);
  // console.log(options);
  rp(options).then((data) => {
    console.log('success')
    let result = JSON.parse(data);
    let contact = result.d.results;
    if (contact.length == 1) {
      let ObjectID = contact[0].ObjectID;
      let UUID = tools.UUIDEndoce(ObjectID);
      let  body = {
        ParentObjectID: store.SocialMediaUserProfileNodeID,
        BusinessPartnerCategoryCode:"1",
        BusinessPartnerRoleCode:"BUP001",
        BusinessPartnerUUID:UUID
      };
      let options = getOption('POST', body, configData.apiList.BP, true);
      getToken().then((data) => {
        options.headers['x-csrf-token'] = data;
        options.json = true;
        rp(options).then((data) => {
          console.log(data);
          data.isCreated = true;
          res.status(200);
          res.send(data);
        }).catch((err) => {
          res.status(400);
          res.send(err);
        });
      }).catch((err) => {
        res.status(400);
        res.send(err);
      });
    } else {
      res.status(200);
      res.send(data)
    }
  }).catch((err) => {
    console.log(err);
    res.status(400);
    res.send(err)
  });
});

app.post('/createBP', (req, res) => {
  console.log('start');
  let  body = {
    ParentObjectID: store.SocialMediaUserProfileNodeID,
    BusinessPartnerCategoryCode:"1",
    BusinessPartnerRoleCode:"BUP001",
    BusinessPartnerUUID:req.body.UUID
  };
  let options = getOption('POST', body, configData.apiList.BP, true);
  getToken().then((data) => {
    options.headers['x-csrf-token'] = data;
    options.json = true;
    rp(options).then((data) => {
      console.log(data);
      res.status(200)
      res.send(data);
    }).catch((err) => {
      res.status(400);
      res.send(err);
    });
  }).catch((err) => {
    res.send(400);
    res.send(err);
  });
});

app.post('/createTicket', (req, res) => {
  console.log('start');
  console.log(req.body);
  let token = getToken();
  let SMUPObjectID = getUserProfile(store.openID, 'SocialMediaUserAccountID', 'ObjectID');
  let body = {
    "CategoryCode": configData.codeCollection.SMACategoryCode,
    "SocialMediaChannelCode":configData.codeCollection.wxChannelCode,
    "SocialMediaMessageID": new Date().valueOf().toString(),
    "InitiatorCode": configData.codeCollection.InitiatorCode,
    "SocialMediaUserProfileUUID":"",
    "Text": req.body.Description,
    "SocialMediaActivityProviderID": configData.codeCollection.providerID
  };
  let options = getOption('POST', body, configData.apiList.SMA, true);
  Promise.all([token, SMUPObjectID]).then((result) => {
    console.log(result);
    if (result[1]) {
      var UUID = tools.UUIDEndoce(result[1]);
    }
    options.body.SocialMediaUserProfileUUID = UUID;
    options.headers["x-csrf-token"] = result[0];
    options.json = true;
    rp(options).then((data) => {
      let ID = data.d.results.ID;
      let queryParam = configData.apiList.ServiceRequestBusinessTransactionDocumentReference + "?$filter=ID eq \'" + ID + "\'" + "and TypeCode eq \'" + configData.codeCollection.typeCode + "\'";
      let options = getOption('GET', '', queryParam);
      options.json = true;
      console.log('start creating')
      rp(options).then((data) => {
        // console.log(data.d.results[0]);
        if (data.d.results[0]) {
          // res.send(data.d.results[0]);
          delete req.body.Description;
          updateTicket(data.d.results[0].ParentObjectID, req.body, result[0])
          let options = getOption('GET', '',configData.apiList.ServiceRequestBusinessTransactionDocumentReference + "(\'" + data.d.results[0].ObjectID + "\')/ServiceRequest", false);
          // console.log(options);
          options.json = true;
          rp(options).then((data) => {
            // console.log(data);
            res.send(data);
            let id = data.d.results.ID;
            rp({
              method: 'post',
              uri: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + store.wxToken.access_token,
              body: {
                touser: store.openID,
                template_id: 'WmzCQaFtQrFW5QMVGRJld6IrvTpjRBDyEORXDdgYaFo',
                url: 'http://weixin.qq.com/download',
                data: {
                  ID: {
                    value: id,
                    color: '#173177'
                  }
                }
              },
              json: true
            }).then((data) => {
              console.log(data)
            })
          })
        }
      }).catch((err) => {
        console.log(err)
        res.status(400);
        res.send();
      })
    }).catch((err) => {
      // console.log(err)
      res.status(400);
      res.send();
    })
  }).catch((err) => {
    // console.log(err)
    res.status(400);
    res.send();
  })
});

app.post('/getTicketList', (req, res) => {
  console.log('enter')
  let key = req.body.key;
  getUserProfile(store.openID,'SocialMediaUserAccountID', 'AccountInternalID').then((data) => {
    console.log(key)
    if(data) {
      let reg = new RegExp("([0]*)([1-9]+[0-9]+)", "g");
      let InternalID = data.replace(reg, "$2");
      let queryParam = configData.apiList.ServiceRequest + "?$filter=ReportedPartyID eq \'" + InternalID + "\'&$format=json&$orderby=ServiceRequestUserLifeCycleStatusCode desc&$top=10&$skip=" + key;
      let options = getOption('GET', '', queryParam, false);
      rp(options).then((data) => {
        let result = JSON.parse(data)
        let list = result.d.results;
        console.log(list)
        res.send(list)
      })
    }
  })
});

app.post('/getTicket',(req, res) => {
  if (req.body.ID) {
    let queryParam = configData.apiList.ServiceRequest + "?$format=json&$filter=ID eq \'" + req.body.ID + "\'&$expand=ServiceRequestBusinessTransactionDocumentReference";
    let options = getOption('GET', '', queryParam, false);
    rp(options).then((data) => {
      console.log(JSON.parse(data));
      let result = JSON.parse(data);
      let ticketDetail = result.d.results[0];
      let nodeID = ticketDetail.ObjectID;
      let ServiceRequestDoc = ticketDetail.ServiceRequestBusinessTransactionDocumentReference
      if (ServiceRequestDoc.length > 0) {
        let SocialMedia = ServiceRequestDoc.find((elem) => (elem.TypeCode == '1607'));
        if (SocialMedia) {
          let SocialMediaID = SocialMedia.ID;
          ticketDetail.isOrigin = true;
          ticketDetail.SocialMediaActivityID = SocialMedia.ID;
        } else {
          ticketDetail.isOrigin = false;
        }
        ticketDetail.isOrigin = true;
      } else {
        ticketDetail.isOrigin = false;
      }
      let queryParam = configData.apiList.ServiceRequestLocation + "?$filter=ParentObjectID eq \'" + nodeID + "\'&$expand=ServiceRequestServicePointLocationAddress";
      let options = getOption('GET', '', queryParam, false);
      options.json = true;
      rp(options).then((data) => {
        if (data.d.results[0].ServiceRequestServicePointLocationAddress) {
          ticketDetail.ServiceRequestLocation = data.d.results[0].ServiceRequestServicePointLocationAddress;
        }
        res.send(ticketDetail)
      })
    })
  }
});

app.post('/replyMsg', (req, res) => {
  if (req.body.msg) {
    let queryParam = configData.apiList.SMA + "?$filter=ID eq \'" + req.body.ID + "\'&$format=json";
    let options = getOption('GET', '', queryParam, true);
    let SMUPObjectID = getUserProfile(store.openID, 'SocialMediaUserAccountID', 'ObjectID');
    let RootSMAUUID = new Promise((res, rej) => {
      rp(options).then((data) => {
        let results = JSON.parse(data);
        console.log(results.d.results)
        res(results.d.results[0].RootSocialMediaActivityUUID);
      })
    });
    let token = getToken();
    Promise.all([RootSMAUUID, token, SMUPObjectID]).then((data) => {
      if (data[0] && data[1] && data[2]) {
        let UUID = tools.UUIDEndoce(data[2])
        let body = {
          CategoryCode: configData.codeCollection.SMACategoryCode,
          SocialMediaChannelCode:configData.codeCollection.wxChannelCode,
          SocialMediaMessageID: new Date().valueOf().toString(),
          InitiatorCode: configData.codeCollection.InitiatorCode,
          ParentSocialMediaActivityUUID: data[0],
          Text: req.body.msg,
          SocialMediaUserProfileUUID: UUID,
          SocialMediaActivityProviderID: configData.codeCollection.providerID
        };
        let queryParam = configData.apiList.SMA;
        let options = getOption('POST', body, queryParam, true);
        options.headers['x-csrf-token'] = data[1];
        options.json = true;
        rp(options).then((data) => {
          if (data.d.results.ObjectID) {
            res.send();
          } else {
            res.status(400);
            res.send()
          }
        })
      }
    })
  }
})

app.post('/wechat/c4c/reply', (req, res) => {
  console.log('reply');
  console.log(req.body);
  res.send();
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
