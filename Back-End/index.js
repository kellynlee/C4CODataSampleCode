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
const getWeChatToken = require('./modules/getWeChatToken');
const getToken = require('./modules/getToken');
const token = require('./store/tokenStore');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const store = require('./store/tokenStore');
const getWxUserInfo = require('./modules/wxHandler/getWxUserInfo');
const getWxJSSDKToken = require('./modules/getWeChatJSSDkToken');
const crypto = require('crypto');

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
    console.log('enter');
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
  getWxToken(configData.WeChat.appID, configData.WeChat.appSecret).then((data) => {
    getWxJSSDKToken(data.access_token).then((data) => {
      let jsapi_ticket = data.token;
      let nonce_str = '123456';
      let timestamp = new Date().getTime();
      let url = req.query.url;
      let str = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + nonce_str + '×tamp=' + timestamp + '&url=' + url
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
                thiz.openID = body.FromUserName[0];
                getWxUserInfo(thiz.openID).then((data) => {
                  console.log('got userinfo')
                  let userInfo = data;
                  let body = {
                    "SocialMediaUserCategoryCode":"02",
                    "SocialMediaUserProfileUserInformation":[{
                      "SocialMediaChannelCode":"001",
                      "GivenName":userInfo.nickname,
                      "ExternalPartyAccountID":"0011",
                      "SocialMediaUserAccountID":userInfo.openid
                    }]
                  };
                  let options = getOption('POST', body, configData.apiList.SMUP, true);
                  getUserProfile(userInfo.openid,'SocialMediaUserAccountID', 'ObjectID').then((data) => {
                    if (!data) {
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
  console.log(options);
  rp(options).then((data) => {
    console.log('success')
    let result = JSON.parse(data);
    let contact = result.d.results;
    if (contact.length == 1) {
      let ObjectID = contact[0].ObjectID;
      let UUID = ObjectID.slice(0,8) +"-"+ ObjectID.slice(8,12) + "-"+ ObjectID.slice(12,16) + "-" + ObjectID.slice(16,20) + "-" + ObjectID.slice(20,ObjectID.length);
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
  let UUID = getUserProfile(store.openID, 'SocialMediaUserAccountID', 'ObjectID');
  let body = {
    "CategoryCode":"001",
    "SocialMediaChannelCode":"008",
    "SocialMediaMessageID":"20181011",
    "InitiatorCode":"2",
    "SocialMediaUserProfileUUID":"",
    "Text": req.body.title,
    "SocialMediaActivityProviderID":"C4C_WECHAT"
  };
  let options = getOption('POST', body, configData.apiList.SMA, true);
  Promise.all([token, UUID]).then((result) => {
    console.log(result);
    if (result[1]) {
      var UUID = result[1].slice(0,8) +"-"+ result[1].slice(8,12) + "-"+result[1].slice(12,16) + "-" + result[1].slice(16,20) + "-" + result[1].slice(20,result[1].length);
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
