webpackJsonp([1],{"0Y+k":function(t,e){},"3mCS":function(t,e){},E51W:function(t,e){},FFKV:function(t,e){},LtoC:function(t,e){},Lzlz:function(t,e){},UazA:function(t,e){},YKDw:function(t,e){},YOWe:function(t,e){},lVK7:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i("7+uW"),o={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"app"},[e("keep-alive",[this.$route.meta.keepAlive?e("router-view"):this._e()],1),this._v(" "),this.$route.meta.keepAlive?this._e():e("router-view")],1)},staticRenderFns:[]};var s=i("VU/8")({data:function(){return{}}},o,!1,function(t){i("nMoZ")},null,null).exports,a=i("/ocq"),r=i("g4PW"),c=i.n(r),l=i("SHZo"),u=(i("OMJi"),{data:function(){return{form:{title:"",description:"",serialID:"",productID:"",priority:"",date:""},isClick:!1,Submit:"Submit",isSubmit:!1,SubjectValidate:[{validate:function(t){return!!t},message:"Please Input Subject"}],DescriptionValidate:[{validate:function(t){return!!t},message:"Please Input Description"}],SerialIDValidate:[{validate:function(t){return/^[0-9a-zA-Z]+$/.test(t)||""==t},message:"SerialID hould be letter and number"}],codeOptions:[{code:"1",text:"Immediate"},{code:"2",text:"Urgent"},{code:"3",text:"Normal"},{code:"7",text:"Low"}]}},computed:{wxCode:function(){return this.$route.query.code},ProductValidate:function(){if(this.form.serialID.length>0)return[{validate:function(t){return!!t},message:"Please Input ProductID"}];this.$refs.productID&&(this.$refs.productID.errorMessage="")}},methods:{registeredProductCompletion:function(){var t=this;if(!this.$refs.serialID.validate()||0==this.form.serialID.length)return!1;this.WXUserInfo.then(function(e){t.isClick=!0,t.$axios({url:t.CONFIG.url.getRegisteredProduct,data:{openID:e.openid,SerialID:t.form.serialID},method:"post"}).then(function(e){t.isClick=!1,200==e.status&&(t.form.productID=e.data)}).catch(function(e){t.isClick=!1,t.$alert(e.response.data)})})},submitTicket:function(){var t=this,e=this,i=c()("production","production");this.$refs.form.validate().then(function(n){if(!n)return!1;e.$confirm("Confirm your information?","Confirm").then(function(n){if(n.result){var o=t.$loading();t.WXUserInfo.then(function(n){t.$axios({url:t.CONFIG.url.createTicket,data:{openID:n.openid,nickName:n.nickname,Name:t.form.title,Description:t.form.description,SerialID:t.form.serialID,ProductID:t.form.productID,ServicePriorityCode:t.form.priority,RequestedFulfillmentPeriodStartDateTime:t.form.date},method:"post"}).then(function(t){o.close(),200==t.status&&(e.isSubmit=!1,e.$toast.success("Create Successfully"),i&&l.a.ready(function(){l.a.closeWindow()}))}).catch(function(t){o.close(),e.$alert(t.response.data)})})}})})},cancelInput:function(){this.$refs.form.clear(),this.form={title:"",description:"",serialID:"",productID:"",priority:"",date:""}},ChangeSelect:function(){}},mounted:function(){this.$axios({method:"post",url:this.CONFIG.url.wxConfig,data:{url:location.href.split("#")[0]}}).then(function(t){console.log(t.data),l.a.config({debug:!1,appId:t.data.appId,timestamp:t.data.timestamp,nonceStr:t.data.nonceStr,signature:t.data.signature,jsApiList:["closeWindow"]})}),this.WXUserInfo=this.common.getWXUserInfo(this.wxCode)}}),m={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"mainContent"},[i("mu-form",{ref:"form",attrs:{model:t.form}},[i("mu-form-item",{attrs:{label:"*Subject",prop:"title",rules:t.SubjectValidate}},[i("mu-text-field",{model:{value:t.form.title,callback:function(e){t.$set(t.form,"title",e)},expression:"form.title"}})],1),t._v(" "),i("mu-form-item",{attrs:{label:"*Problem Description",prop:"description",rules:t.DescriptionValidate}},[i("mu-text-field",{model:{value:t.form.description,callback:function(e){t.$set(t.form,"description",e)},expression:"form.description"}})],1),t._v(" "),i("mu-form-item",{ref:"serialID",attrs:{label:"SerialID",prop:"serialID",rules:t.SerialIDValidate}},[i("mu-text-field",{staticStyle:{width:"80%"},model:{value:t.form.serialID,callback:function(e){t.$set(t.form,"serialID",e)},expression:"form.serialID"}}),t._v(" "),i("mu-button",{directives:[{name:"loading",rawName:"v-loading",value:t.isClick,expression:"isClick"}],staticStyle:{"min-width":"20%","margin-right":"0","margin-left":"0"},attrs:{color:"primary","data-mu-loading-size":"24","data-mu-loading-overlay-color":"hsla(0,0%,98%,.9)",ripple:!1,flat:!0,small:""},on:{click:t.registeredProductCompletion}},[i("mu-icon",{attrs:{value:"search"}})],1)],1),t._v(" "),i("mu-form-item",{ref:"productID",attrs:{label:"ProductID",prop:"productID",rules:t.ProductValidate}},[i("mu-text-field",{model:{value:t.form.productID,callback:function(e){t.$set(t.form,"productID",e)},expression:"form.productID"}})],1),t._v(" "),i("mu-form-item",{attrs:{label:"Priority",prop:"priority"}},[i("mu-select",{on:{change:t.ChangeSelect},model:{value:t.form.priority,callback:function(e){t.$set(t.form,"priority",e)},expression:"form.priority"}},t._l(t.codeOptions,function(t){return i("mu-option",{key:t.code,attrs:{label:t.text,value:t.code}})}))],1),t._v(" "),i("mu-form-item",{attrs:{label:"Request on-site Date",prop:"date"}},[i("mu-date-input",{attrs:{type:"dateTime"},model:{value:t.form.date,callback:function(e){t.$set(t.form,"date",e)},expression:"form.date"}})],1),t._v(" "),i("mu-form-item",[i("mu-button",{staticClass:"button",attrs:{color:"primary"},on:{click:t.submitTicket}},[t._v(t._s(t.Submit))]),t._v(" "),i("mu-button",{staticClass:"button",on:{click:t.cancelInput}},[t._v("Reset")])],1)],1)],1)},staticRenderFns:[]};var d=i("VU/8")(u,m,!1,function(t){i("LtoC")},"data-v-946cb6f8",null).exports,f={data:function(){return{inputValidator:[{validate:function(t){return!!t},message:"Phone Numer Shouldn't be Empty"},{validate:function(t){return/^[0-9]*$/.test(t)},message:"Please Input Number"},{validate:function(t){return 11==t.length},message:"Phone Number Should be 11 Degits"}],formData:{phone:""},contactList:[],selectedContact:"",isClick:!1,isSelected:!1,isQuery:!0,contactDetail:{},isLinked:!1}},computed:{wxCode:function(){return this.$route.query.code}},methods:{onSelect:function(){this.isSelected=!0},submitData:function(){var t=this,e=this;this.CONFIG.Url;this.$refs.form.validate().then(function(i){if(!i)return!1;e.$confirm("Confirm your information?","Confirm").then(function(i){if(i.result){var n=t.$loading();e.isQuery=!0,t.WXUserInfo.then(function(i){e.$axios({method:"post",url:t.CONFIG.url.getContactCollection,data:{openID:i.openid,nickName:i.nickname,headImageUrl:i.headimgurl,phone:t.formData.phone}}).then(function(o){e.isQuery=!1,console.log(o),o.data.isCreated?(e.$toast.success("Success"),t.$axios({method:"post",url:t.CONFIG.url.getSMUP,data:{openID:i.openid}}).then(function(e){n.close(),e.data&&(t.contactDetail=e.data,t.isLinked=!0)}).catch(function(t){n.close(),e.$alert("Error")})):o.data.length>0?(n.close(),e.$toast.success("Success"),e.contactList=o.data.concat()):(n.close(),e.$alert("No Contact Found"))}).catch(function(t){n.close(),e.$alert("Create Failed")})})}})})},createBP:function(){var t=this,e=this,i=this.selectedContact.ObjectID.slice(0,8)+"-"+this.selectedContact.ObjectID.slice(8,12)+"-"+this.selectedContact.ObjectID.slice(12,16)+"-"+this.selectedContact.ObjectID.slice(16,20)+"-"+this.selectedContact.ObjectID.slice(20,this.selectedContact.ObjectID.length),n=this.$loading();this.WXUserInfo.then(function(o){t.$axios({url:t.CONFIG.url.createBP,method:"post",data:{UUID:i,openID:o.openid,nickName:o.nickname,headImageUrl:o.headimgurl}}).then(function(i){if(n.close(),!i.data.isCreated)throw new Error;t.$toast.success("Create Successfully"),e.isSelected=!1}).catch(function(t){n.close(),e.$alert("Create Failed")})})},cancelInput:function(){this.formData.phone=""}},mounted:function(){var t=this;console.log(this.wxCode);var e=this.$loading();this.WXUserInfo=this.common.getWXUserInfo(this.wxCode),this.WXUserInfo.then(function(i){t.$axios({method:"post",url:t.CONFIG.url.getSMUP,data:{openID:i.openid}}).then(function(i){e.close(),i.data&&(t.contactDetail=i.data,t.isLinked=!0)})})}},p={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"mainBody"},[t.isLinked?t._e():i("div",[i("mu-form",{ref:"form",attrs:{model:t.formData,"label-width":80}},[i("mu-form-item",{attrs:{prop:"phone",label:"Phone",rules:t.inputValidator}},[i("mu-text-field",{attrs:{prop:"phone","max-length":11},model:{value:t.formData.phone,callback:function(e){t.$set(t.formData,"phone",e)},expression:"formData.phone"}})],1),t._v(" "),i("mu-form-item",[i("mu-button",{directives:[{name:"loading",rawName:"v-loading",value:t.isClick,expression:"isClick"}],staticClass:"button",attrs:{color:"primary","data-mu-loading-size":"24",disabled:t.isClick},on:{click:t.submitData}},[t._v("Submit")]),t._v(" "),i("mu-button",{staticClass:"button",on:{click:t.cancelInput}},[t._v("Reset")])],1)],1),t._v(" "),i("mu-paper",{staticClass:"paper",attrs:{"z-depth":4}},[t._l(t.contactList,function(e){return i("mu-flex",{key:e.id,staticClass:"radioContent"},[i("mu-radio",{staticClass:"radio",attrs:{value:e,label:e.FirstName},on:{change:t.onSelect},model:{value:t.selectedContact,callback:function(e){t.selectedContact=e},expression:"selectedContact"}})],1)}),t._v(" "),t.isSelected?i("mu-button",{staticClass:"button",attrs:{color:"primary"},on:{click:t.createBP}},[t._v("Create")]):t._e(),t._v(" "),t.isSelected?i("mu-button",{staticClass:"button"},[t._v("Cancel")]):t._e()],2)],1),t._v(" "),t.isLinked?i("div",[i("mu-list",[i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Your Contact:")])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Name:")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.contactDetail.Name))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Phone:")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.contactDetail.Phone))])],1)],1)],1)],1):t._e()])},staticRenderFns:[]};var v=i("VU/8")(f,p,!1,function(t){i("YKDw")},"data-v-04fe2a6e",null).exports,h=i("bOdI"),_=i.n(h),C=(Object,{data:function(){return{}},props:{ticket:{type:Object}},computed:{ServiceRequestUserLifeCycleStatusCodeText:function(){return-1!=this.ticket.ServiceRequestUserLifeCycleStatusCodeText.indexOf("In Process")?"In Process":this.ticket.ServiceRequestUserLifeCycleStatusCodeText}}}),g={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("mu-paper",{staticClass:"paperContainer",attrs:{"z-depth":1,round:"true"}},[i("mu-flex",{staticClass:"item",attrs:{direction:"column"}},[i("mu-flex",{staticClass:"itemBody",attrs:{fill:"","align-items":"center"}},[i("mu-list",[i("mu-list-item",[i("mu-row",{staticClass:"txtContent"},[i("mu-col",{attrs:{span:"3"}},[i("mu-list-item-content",[t._v("ID")])],1),t._v(" "),i("mu-col",{attrs:{span:"9"}},[i("mu-list-item-content",[t._v(t._s(t.ticket.ID))])],1)],1)],1)],1)],1),t._v(" "),i("mu-flex",{staticClass:"itemBody",attrs:{fill:"","align-items":"center"}},[i("mu-list",[i("mu-list-item",[i("mu-row",{staticClass:"txtContent"},[i("mu-col",{attrs:{span:"3"}},[i("mu-list-item-content",[t._v("Subject")])],1),t._v(" "),i("mu-col",{attrs:{span:"9"}},[i("mu-list-item-content",[t._v(t._s(t.ticket.Name))])],1)],1)],1)],1)],1),t._v(" "),i("mu-flex",{staticClass:"itemBody",attrs:{fill:"","align-items":"center"}},[i("mu-list",[i("mu-list-item",[i("mu-list-item-content",[i("mu-badge",{staticClass:"ticketBadge",attrs:{content:t.ServiceRequestUserLifeCycleStatusCodeText,color:"primary"}}),t._v(" "),i("mu-badge",{attrs:{content:t.ticket.Channel}})],1)],1)],1)],1)],1)],1)},staticRenderFns:[]};var I=i("VU/8")(C,g,!1,function(t){i("YOWe")},"data-v-92fd7d4a",null).exports,b={data:function(){return _()({isFirstEnter:!1,isNav:!1,key:0,userInfo:{},ticketList:[],loading:!1},"key",0)},computed:{wxCode:function(){return this.$route.query.code}},components:{TicketListItem:I},methods:{openTicketDetail:function(t){console.log(t),this.isNav=!0,this.$router.push({name:"TicketDetail",params:{openID:this.userInfo.openid,nickName:this.userInfo.nickname,id:t}})},load:function(){var t=this;return!this.isNav&&(!(this.ticketList.length<10)&&(this.loading=!0,this.key+=10,void this.WXUserInfo.then(function(e){t.$axios({method:"post",url:t.CONFIG.url.getTicketList,data:{key:t.key,openID:e.openid}}).then(function(e){t.loading=!1,e.data.length>0?t.ticketList=t.ticketList.concat(e.data):t.$alert("No more ticket!")})})))}},beforeRouteEnter:function(t,e,i){"TicketDetail"==e.name&&(t.meta.isBack=!0),i()},created:function(){this.isFirstEnter=!0},activated:function(){var t=this;if(!this.$route.meta.isBack||this.isFirstEnter){var e=this.$loading();this.WXUserInfo=this.common.getWXUserInfo(this.wxCode),this.WXUserInfo.then(function(i){t.userInfo=i,t.$axios({method:"post",url:t.CONFIG.url.getTicketList,data:{key:t.key,openID:i.openid}}).then(function(i){if(e.close(),200==i.status){if(0==i.data.length)return t.$alert("No ticket found!"),!1;t.ticketList=t.ticketList.concat(i.data)}}).catch(function(i){e.close(),t.$alert("Please bind Contact first!")})})}this.$route.meta.isBack=!1,this.isFirstEnter=!1,this.isNav=!1,this.$children[0].$children[0].$el.style.scrollTop=0}},k={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"mainContent"},[i("div",{staticClass:"listContent"},[i("mu-load-more",{attrs:{loading:t.loading},on:{load:t.load}},t._l(t.ticketList,function(e){return i("div",{key:e.ID},[i("ticket-list-item",{attrs:{ticket:e},nativeOn:{click:function(i){t.openTicketDetail(e.ID)}}})],1)}))],1)])},staticRenderFns:[]};var D=i("VU/8")(b,k,!1,function(t){i("Lzlz")},"data-v-db4bc8ec",null).exports,y=i("//Fk"),S=i.n(y),x=(Object,{data:function(){return{isEnable:!0,openDialog:!1,msg:""}},props:{detail:{type:Object}},computed:{isInputValue:function(){return!(this.msg.length>0)}},methods:{backToList:function(){this.$router.push("/TicketList")},open:function(){this.openDialog=!0},replyMsg:function(){var t=this,e=this.$loading();this.msg.length>0&&this.$parent.WXUserInfo.then(function(i){t.$axios({method:"post",url:t.CONFIG.url.replyMsg,data:{openID:i.openid,nickName:i.nickname,msg:t.msg,ID:t.detail.RootSocialMediaActivity.ID}}).then(function(i){e.close(),console.log(i.data),200==i.status?(t.openDialog=!1,t.$toast.success("Reply successfully!")):(t.openDialog=!1,t.$toast.error("Reply Failed!"))})})},cancel:function(){this.openDialog=!1,this.msg=""}}}),$={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"detailContent"},[i("mu-list",{attrs:{textline:"two-line"}},[i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Subject")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.Name))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Account")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.BuyerPartyName))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Contact/Individual Customer")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.BuyerMainContactPartyName))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Description")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.Description))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Priority")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.ServicePriorityCodeText))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Status")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.ServiceRequestUserLifeCycleStatusCodeText))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Processor")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.ProcessorPartyName))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Product Description")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.ProductDescription))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Product SerialID")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.SerialID))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("ServiceTechnician:")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.ServicePerformerPartyName))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Country: ")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.ServiceRequestServicePointLocation.ServiceRequestServicePointLocationAddress.CountryText))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Street: ")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.ServiceRequestServicePointLocation.ServiceRequestServicePointLocationAddress.Street))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("HouseNumber: "+t._s(t.detail.ServiceRequestServicePointLocation.ServiceRequestServicePointLocationAddress.HouseNumber))]),t._v(" "),i("mu-list-item-sub-title")],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("City: ")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.ServiceRequestServicePointLocation.ServiceRequestServicePointLocationAddress.City))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("State: ")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.ServiceRequestServicePointLocation.ServiceRequestServicePointLocationAddress.StateText))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Postal: ")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.ServiceRequestServicePointLocation.ServiceRequestServicePointLocationAddress.PostalCode))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Requested Start Time:")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.RequestedFulfillmentPeriodStartDateTime))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Requested End Time:")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.RequestedFulfillmentPeriodEndDateTime))])],1)],1)],1),t._v(" "),i("mu-flex",{attrs:{"justify-content":"center","align-item":"center"}},[i("div",{staticClass:"btnBox"},[i("mu-button",{attrs:{round:"",color:"primary",disabled:!t.detail.isOrigin,"full-width":""},on:{click:t.open}},[t._v("\n                    Reply\n                    "),i("mu-icon",{attrs:{right:"",value:"send"}})],1)],1)]),t._v(" "),i("mu-dialog",{attrs:{title:"Reply",width:"360",transition:"slide-bottom",fullscreen:"",open:t.openDialog},on:{"update:open":function(e){t.openDialog=e}}},[i("mu-text-field",{staticStyle:{"padding-right":"20px"},attrs:{"multi-line":"",rows:8,"max-length":280,icon:"comment",placeholder:"Input Reply Message","full-width":""},model:{value:t.msg,callback:function(e){t.msg=e},expression:"msg"}}),i("br"),t._v(" "),i("mu-button",{attrs:{slot:"actions",flat:"",color:"primary",disabled:t.isInputValue},on:{click:t.replyMsg},slot:"actions"},[t._v("Reply")]),t._v(" "),i("mu-button",{attrs:{slot:"actions",flat:"",color:"primary"},on:{click:t.cancel},slot:"actions"},[t._v("Cancel")])],1)],1)},staticRenderFns:[]};var P=i("VU/8")(x,$,!1,function(t){i("UazA")},"data-v-42ba3c84",null).exports,L=(Object,{data:function(){return{}},props:{message:{type:Object}},computed:{isInBound:function(){return"3"!=this.message.InitiatorCode}}}),R={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"chatBox"},[t.isInBound?t._e():i("mu-row",{attrs:{gutter:""}},[i("mu-col",{attrs:{span:"2"}},[i("mu-flex",{staticClass:"authorBox",attrs:{direction:"column","justify-content":"center","align-items":"center"}},[i("mu-avatar",{attrs:{color:"indigo"}},[i("mu-icon",{attrs:{value:"account_circle"}})],1),t._v(" "),i("div",{staticStyle:{"font-size":"10px"}},[t._v(t._s(t.message.SocialMediaMessageAuthor))])],1)],1),t._v(" "),i("mu-col",{attrs:{span:"8",direction:"column","justify-content":"center"}},[i("div",{staticClass:"textBox outBound"},[t._v(t._s(t.message.Text))]),t._v(" "),i("div",{staticClass:"clear"})])],1),t._v(" "),t.isInBound?i("mu-row",{attrs:{gutter:""}},[i("mu-col",{attrs:{span:"8",offset:"2","justify-content":"center"}},[i("div",{staticClass:"textBox inBound"},[t._v(t._s(t.message.Text))]),t._v(" "),i("div",{staticClass:"clear"})]),t._v(" "),i("mu-col",{attrs:{span:"2"}},[i("mu-flex",{staticClass:"authorBox",attrs:{direction:"column","justify-content":"center","align-items":"center"}},[i("mu-avatar",{staticStyle:{"margin-bottom":"1rem"},attrs:{color:"indigo"}},[i("mu-icon",{attrs:{value:"account_circle"}})],1)],1)],1)],1):t._e()],1)},staticRenderFns:[]};var T=i("VU/8")(L,R,!1,function(t){i("FFKV")},"data-v-0926a04a",null).exports,O=(Object,{data:function(){return{interaction:[]}},props:{activity:{type:Object}},components:{ChatModule:T},mounted:function(){var t=this,e=this.$loading();this.activity&&this.$axios({method:"post",url:this.CONFIG.url.getInteractionHistory,data:{ObjectID:this.activity.ObjectID}}).then(function(i){e.close(),console.log(i),t.interaction=i.data.concat()})}}),U={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",this._l(this.interaction,function(t){return e("div",{key:t.ID,staticClass:"chatContainer"},[e("chat-module",{attrs:{message:t}})],1)}))},staticRenderFns:[]};var w=i("VU/8")(O,U,!1,function(t){i("3mCS")},"data-v-93ffdf3c",null).exports,N={data:function(){return{ticketDetail:{ServiceRequestServicePointLocation:{ServiceRequestServicePointLocationAddress:{}}},socialMediaActivity:{},interactionHistory:[{SocialMediaMessageAuthor:"C4C",Text:"reply from c4c",inBound:!1},{SocialMediaMessageAuthor:"WeChat",Text:"reply in WeChat",inBound:!0},{SocialMediaMessageAuthor:"C4C",Text:"reply from c4c",inBound:!1},{SocialMediaMessageAuthor:"C4C",Text:"reply from c4c",inBound:!1},{SocialMediaMessageAuthor:"WeChat",Text:"reply in WeChat",inBound:!0}],componentId:"DetailComponent"}},components:{DetailComponent:P,InteractionComponent:w},computed:{ObjectID:function(){return this.$route.params.id},userInfo:function(){return{openid:this.$route.params.openID,nickname:this.$route.params.nickName}},wxCode:function(){return this.$route.query.code},interactionPath:function(){return"/TicketDetail/InteractionHistory/"+this.ticketDetail.SocialMediaActivityID},detailPath:function(){return"/TicketDetail/"+this.ticketDetail.ID}},methods:{},mounted:function(){var t=this,e=this.$loading();this.wxCode?this.WXUserInfo=this.common.getWXUserInfo(this.wxCode):this.WXUserInfo=new S.a(function(e,i){e(t.userInfo)}),this.$axios({method:"post",url:this.CONFIG.url.getTicket,data:{ID:this.ObjectID}}).then(function(i){e.close(),console.log(i.data),200==i.status&&(t.ticketDetail=i.data,t.socialMediaActivity=i.data.RootSocialMediaActivity)})}},F={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"mainContent"},[i(t.componentId,{tag:"component",staticClass:"listContent",attrs:{detail:t.ticketDetail,activity:t.socialMediaActivity}}),t._v(" "),i("mu-bottom-nav",{staticClass:"tabBar",attrs:{value:t.componentId},on:{"update:value":function(e){t.componentId=e}}},[i("mu-bottom-nav-item",{attrs:{title:"Detail",icon:"details",value:"DetailComponent"}}),t._v(" "),i("mu-bottom-nav-item",{attrs:{title:"InteractionLog",icon:"history",value:"InteractionComponent"}})],1)],1)},staticRenderFns:[]};var M=i("VU/8")(N,F,!1,function(t){i("wMpq")},"data-v-42e90630",null).exports;n.a.use(a.a);var A=new a.a({mode:"history",scrollBehavior:function(t,e,i){return{x:0,y:0}},routes:[{name:"SocialMediaActivityCreate",path:"/SocialMediaActivityCreate",component:d,meta:{keepAlive:!1}},{name:"ContactCollection",path:"/ContactCollection",component:v,meta:{keepAlive:!1}},{name:"TicketList",path:"/TicketList",component:D,meta:{keepAlive:!0,isBack:!1}},{name:"TicketDetail",path:"/TicketDetail/:id",component:M,meta:{keepAlive:!1}}]}),B=i("mtWM"),j=i.n(B),q=i("aFc6"),W=(i("E51W"),i("1kwf")),V=(i("0Y+k"),i("sXio")),E=i("w7Ps"),X=i("mrgY"),G=i.n(X);const z=i("mrgY"),Y=i("mtWM");var H={getWXUserInfo:t=>new Promise((e,i)=>{Y({method:"post",url:z.url.getOpenID,data:{code:t}}).then(t=>{e(t.data)})})};n.a.use(q.a),n.a.use(W.a),n.a.use(V.a),n.a.use(E.a),n.a.use(l.a),n.a.config.debug=!0,n.a.config.productionTip=!1,j.a.defaults.baseURL="api/",n.a.prototype.$axios=j.a,n.a.prototype.CONFIG=G.a,n.a.prototype.common=H,new n.a({el:"#app",router:A,template:"<App/>",components:{App:s}})},mrgY:function(t,e,i){const n=Object.is("production","production"),o=n?"https://c4codatasample.cfapps.us10.hana.ondemand.com":"http://localhost:4000",s={createTicket:o+"/createTicket",createBP:o+"/createBP",getContactCollection:o+"/getContactCollection",wxConfig:o+"/wxJssdk/getJssdk",getTicket:o+"/getTicket",getTicketList:o+"/getTicketList",replyMsg:o+"/replyMsg",getSMUP:o+"/getSMUP",getOpenID:o+"/getOpenID",getInteractionHistory:o+"/getInteractionHistory",getRegisteredProduct:o+"/getRegisteredProduct"};t.exports={baseUrl:n?"https://c4codatasample.cfapps.us10.hana.ondemand.com":"api/",url:s}},nMoZ:function(t,e){},wMpq:function(t,e){}},["lVK7"]);
//# sourceMappingURL=app.34e478bf9ff4a66017f1.js.map