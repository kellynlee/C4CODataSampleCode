webpackJsonp([1],{"+IrM":function(t,e,i){"use strict";var n={render:function(){var t=this.$createElement;return(this._self._c||t)("div",[this._v("\n    interaction\n")])},staticRenderFns:[]};e.a=n},"/uQI":function(t,e){},"0Y+k":function(t,e){},"48zv":function(t,e){},"8O15":function(t,e){},"8heQ":function(t,e){},"9qAM":function(t,e){},"9re4":function(t,e,i){"use strict";var n=i("SH6g"),s=(i.n(n),i("/uQI")),o=i.n(s),a=i("+IrM");var l=function(t){i("NzJK")},c=i("VU/8")(o.a,a.a,!1,l,"data-v-db3ba350",null);e.default=c.exports},E51W:function(t,e){},NzJK:function(t,e){},SH6g:function(t,e){},gxhz:function(t,e){},jHeF:function(t,e){},lD31:function(t,e){},lVK7:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i("7+uW"),s={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"app"},[e("div",{staticClass:"content"},[e("router-view")],1)])},staticRenderFns:[]};var o=i("VU/8")({data:function(){return{}}},s,!1,function(t){i("lD31")},null,null).exports,a=i("/ocq"),l=i("g4PW"),c=i.n(l),r=i("SHZo"),u=(i("OMJi"),{data:function(){return{form:{title:"",description:"",serialID:"",priority:"",date:""},Submit:"Submit",isSubmit:!1,validateRules:[{validate:function(t){return!!t},message:"Please input Title"}],codeOptions:[{code:"1",text:"Very High"},{code:"2",text:"High"},{code:"3",text:"Medium"},{code:"7",text:"Low"}]}},computed:{wxCode:function(){return this.$route.query.code}},methods:{submitTicket:function(){var t=this,e=this,i=c()("production","production");if(this.form.title){var n=this.$loading();this.openID.then(function(s){t.$axios({url:t.CONFIG.url.createTicket,data:{openID:s,Name:t.form.title,Description:t.form.description,SerialID:t.form.serialID,ServicePriorityCode:t.form.priority,OnSiteArrivalDateTime:t.form.date},method:"post"}).then(function(t){console.log(t),n.close(),200==t.status&&(e.isSubmit=!1,e.$toast.success("Create Successfully"),i&&r.a.ready(function(){r.a.closeWindow()}))})})}else this.$alert()},cancelInput:function(){this.form={title:"",description:"",serialID:"",priority:"",date:""}}},mounted:function(){this.$axios({method:"post",url:this.CONFIG.url.wxConfig,data:{url:location.href.split("#")[0]}}).then(function(t){console.log(t.data),r.a.config({debug:!0,appId:t.data.appId,timestamp:t.data.timestamp,nonceStr:t.data.nonceStr,signature:t.data.signature,jsApiList:["closeWindow"]})}),this.openID=this.common.getOpenID(this.wxCode)}}),m={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"mainContent"},[i("mu-form",{attrs:{model:t.form}},[i("mu-form-item",{attrs:{label:"*Title",prop:"title",rules:t.validateRules}},[i("mu-text-field",{model:{value:t.form.title,callback:function(e){t.$set(t.form,"title",e)},expression:"form.title"}})],1),t._v(" "),i("mu-form-item",{attrs:{label:"Problem Description",prop:"description"}},[i("mu-text-field",{model:{value:t.form.description,callback:function(e){t.$set(t.form,"description",e)},expression:"form.description"}})],1),t._v(" "),i("mu-form-item",{attrs:{label:"SerialID",prop:"serialID"}},[i("mu-text-field",{model:{value:t.form.serialID,callback:function(e){t.$set(t.form,"serialID",e)},expression:"form.serialID"}})],1),t._v(" "),i("mu-form-item",{attrs:{label:"Priority",prop:"priority"}},[i("mu-select",{on:{change:t.ChangeSelect},model:{value:t.form.priority,callback:function(e){t.$set(t.form,"priority",e)},expression:"form.priority"}},t._l(t.codeOptions,function(t){return i("mu-option",{key:t.code,attrs:{label:t.text,value:t.code}})}))],1),t._v(" "),i("mu-form-item",{attrs:{label:"Request on-site Date",prop:"date"}},[i("mu-date-input",{attrs:{type:"dateTime"},model:{value:t.form.date,callback:function(e){t.$set(t.form,"date",e)},expression:"form.date"}})],1),t._v(" "),i("mu-form-item",[i("mu-button",{staticClass:"button",attrs:{color:"primary"},on:{click:t.submitTicket}},[t._v(t._s(t.Submit))]),t._v(" "),i("mu-button",{staticClass:"button",on:{click:t.cancelInput}},[t._v("Cancel")])],1)],1)],1)},staticRenderFns:[]};var d=i("VU/8")(u,m,!1,function(t){i("8heQ")},"data-v-046b9af5",null).exports,p={data:function(){return{inputValidator:[{validate:function(t){return!!t},message:"Please input phone number"}],formData:{phone:""},contactList:[],selectedContact:"",isClick:!1,isSelected:!1,isQuery:!0,contactDetail:{},isLinked:!1}},computed:{wxCode:function(){return this.$route.query.code}},methods:{onSelect:function(){this.isSelected=!0},submitData:function(){var t=this,e=this,i=(this.CONFIG.Url,/^[0-9]*$/);this.$refs.form.validate().then(function(n){n?i.test(e.formData.phone)?e.formData.phone.length<11?e.$alert("Please input valid phone number"):e.$confirm("Confirm your information?","Confirm").then(function(i){if(i.result){var n=t.$loading();e.isQuery=!0,t.openID.then(function(i){e.$axios({method:"post",url:t.CONFIG.url.getContactCollection,data:{openID:i,phone:t.formData.phone}}).then(function(t){e.isQuery=!1,n.close(),console.log(t),t.data.isCreated?e.$toast.success("Success"):t.data.d.results.length>0?(e.$toast.success("Success"),e.contactList=t.data.d.results.concat()):e.$toast.error("No Contact Found")})})}}):e.$alert("Please input number","Alert"):e.$alert("Please input phone","Alert")})},createBP:function(){var t=this,e=this,i=this.selectedContact.ObjectID.slice(0,8)+"-"+this.selectedContact.ObjectID.slice(8,12)+"-"+this.selectedContact.ObjectID.slice(12,16)+"-"+this.selectedContact.ObjectID.slice(16,20)+"-"+this.selectedContact.ObjectID.slice(20,this.selectedContact.ObjectID.length);this.openID.then(function(n){t.$axios({url:t.CONFIG.url.createBP,method:"post",data:{UUID:i,openID:n}}).then(function(i){t.$toast.success("Create Successfully"),e.isSelected=!1})})},cancelInput:function(){this.formData.phone=""}},mounted:function(){var t=this,e=this.$loading();this.openID=this.common.getOpenID(this.wxCode),this.openID.then(function(i){t.$axios({method:"post",url:t.CONFIG.url.getSMUP,data:{openID:i}}).then(function(i){e.close(),i.data&&(t.contactDetail=i.data,t.isLinked=!0)})})}},v={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"mainBody"},[t.isLinked?t._e():i("div",[i("mu-form",{ref:"form",attrs:{model:t.formData,"label-width":80}},[i("mu-form-item",{attrs:{prop:"phone",label:"Phone",rules:t.inputValidator}},[i("mu-text-field",{attrs:{prop:"phone"},model:{value:t.formData.phone,callback:function(e){t.$set(t.formData,"phone",e)},expression:"formData.phone"}})],1),t._v(" "),i("mu-form-item",[i("mu-button",{directives:[{name:"loading",rawName:"v-loading",value:t.isClick,expression:"isClick"}],staticClass:"button",attrs:{color:"primary","data-mu-loading-size":"24",disabled:t.isClick},on:{click:t.submitData}},[t._v("Submit")]),t._v(" "),i("mu-button",{staticClass:"button",on:{click:t.cancelInput}},[t._v("Cancel")])],1)],1),t._v(" "),i("mu-paper",{staticClass:"paper",attrs:{"z-depth":4}},[t._l(t.contactList,function(e){return i("mu-flex",{key:e.id,staticClass:"radioContent"},[i("mu-radio",{staticClass:"radio",attrs:{value:e,label:e.FirstName},on:{change:t.onSelect},model:{value:t.selectedContact,callback:function(e){t.selectedContact=e},expression:"selectedContact"}})],1)}),t._v(" "),t.isSelected?i("mu-button",{staticClass:"button",attrs:{color:"primary"},on:{click:t.createBP}},[t._v("Create")]):t._e(),t._v(" "),t.isSelected?i("mu-button",{staticClass:"button"},[t._v("Cancel")]):t._e()],2)],1),t._v(" "),t.isLinked?i("div",[i("mu-list",[i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Your Contact:")])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Name:")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.contactDetail.Name))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Phone:")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.contactDetail.Phone))])],1)],1)],1)],1):t._e()])},staticRenderFns:[]};var f=i("VU/8")(p,v,!1,function(t){i("gxhz")},"data-v-fb388d8c",null).exports,h=(Object,{data:function(){return{}},props:{ticket:{type:Object}}}),_={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"item"},[i("mu-flex",{staticClass:"item",attrs:{direction:"column"}},[i("mu-flex",{staticClass:"itemBody",attrs:{fill:"","align-items":"center"}},[i("mu-list",[i("mu-list-item",[i("mu-list-item-content",[t._v("ID")]),t._v(" "),i("mu-list-item-content",[t._v(t._s(t.ticket.ID))])],1)],1)],1),t._v(" "),i("mu-flex",{staticClass:"itemBody",attrs:{fill:"","align-items":"center"}},[i("mu-list",[i("mu-list-item",[i("mu-list-item-content",[t._v("Subject")]),t._v(" "),i("mu-list-item-content",[t._v(t._s(t.ticket.Name))])],1)],1)],1),t._v(" "),i("mu-flex",{staticClass:"itemBody",attrs:{fill:"","align-items":"center"}},[i("mu-list",[i("mu-list-item",[i("mu-list-item-content",[i("mu-badge",{staticClass:"ticketBadge",attrs:{content:t.ticket.ServiceRequestUserLifeCycleStatusCodeText,color:"primary"}})],1)],1)],1)],1)],1)],1)},staticRenderFns:[]};var C=i("VU/8")(h,_,!1,function(t){i("jHeF")},"data-v-a3b690ae",null).exports,g={data:function(){return{ticketList:[],loading:!1,key:0}},computed:{wxCode:function(){return this.$route.query.code}},components:{TicketListItem:C},methods:{openTicketDetail:function(t){console.log(t),this.$router.push("/TicketDetail/"+t)},load:function(){var t=this;if(this.ticketList.length<10)return!1;this.loading=!0,this.key+=10,this.$axios({method:"post",url:this.CONFIG.url.getTicketList,data:{key:this.key}}).then(function(e){t.loading=!1,e.data.length>0?t.ticketList=t.ticketList.concat(e.data):t.$toast.error("No more ticket!")})}},mounted:function(){var t=this,e=this.$loading();this.openID=this.common.getOpenID(this.wxCode),this.openID.then(function(i){t.$axios({method:"post",url:t.CONFIG.url.getTicketList,data:{key:t.key,openID:i}}).then(function(i){if(e.close(),0==i.data.length)return t.$toast.error("No ticket found!"),!1;t.ticketList=t.ticketList.concat(i.data)})})}},b={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"mainContent"},[i("div",{staticClass:"listContent"},[i("mu-load-more",{attrs:{loading:t.loading},on:{load:t.load}},t._l(t.ticketList,function(e){return i("div",{key:e.ID},[i("ticket-list-item",{attrs:{ticket:e},nativeOn:{click:function(i){t.openTicketDetail(e.ID)}}})],1)}))],1)])},staticRenderFns:[]};var D=i("VU/8")(g,b,!1,function(t){i("48zv")},"data-v-c7f5f304",null).exports,y=(Object,{data:function(){return{isEnable:!0,openDialog:!1,msg:""}},props:{detail:{type:Object}},methods:{backToList:function(){this.$router.push("/TicketList")},open:function(){this.openDialog=!0},replyMsg:function(){var t=this,e=this.$loading();this.msg.length>0&&this.$parent.openID.then(function(i){t.$axios({method:"post",url:t.CONFIG.url.replyMsg,data:{openID:i,msg:t.msg,ID:t.detail.SocialMediaActivityID}}).then(function(i){e.close(),200==i.status?(t.openDialog=!1,t.$toast.success("Reply successfully!")):(t.openDialog=!1,t.$toast.error("Reply Failed!"))})})},cancel:function(){this.openDialog=!1,this.msg=""}}}),I={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"detailContent"},[i("mu-list",{attrs:{textline:"two-line"}},[i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Subject")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.Name))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Account")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.BuyerPartyName))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Contact/Individual Customer")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.BuyerMainContactPartyName))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Description")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.Name))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Priority")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.ServicePriorityCodeText))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Status")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.ServiceRequestUserLifeCycleStatusCodeText))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Prosser")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.ProcessorPartyName))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Product Description")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.ProductDescription))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Product SerialID")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.SerialID))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Warranty")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.WarrantyGoodwillCode))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("WarrantyDate: ")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.WarrantyStartdatetimeContent))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("ServiceTechnician:")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.ServicePerformerPartyName))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Country: ")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.ServiceRequestLocation.CountryText))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Street: ")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.ServiceRequestLocation.Street))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("HouseNumber: "+t._s(t.detail.ServiceRequestLocation.HouseNumber))]),t._v(" "),i("mu-list-item-sub-title")],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("City: ")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.ServiceRequestLocation.City))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("State: ")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.ServiceRequestLocation.State))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Postal: ")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.ServiceRequestLocation.PostalCode))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Requested Start Time:")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.RequestedFulfillmentPeriodStartDateTime))])],1)],1),t._v(" "),i("mu-list-item",[i("mu-list-item-content",[i("mu-list-item-title",[t._v("Requested End Time:")]),t._v(" "),i("mu-list-item-sub-title",[t._v(t._s(t.detail.RequestedFulfillmentPeriodEndDateTime))])],1)],1)],1),t._v(" "),i("mu-flex",{attrs:{"justify-content":"center","align-item":"center"}},[i("div",{staticClass:"btnBox"},[i("mu-button",{attrs:{round:"",color:"primary",disabled:!t.detail.isOrigin,"full-width":""},on:{click:t.open}},[t._v("\n                    Reply\n                    "),i("mu-icon",{attrs:{right:"",value:"send"}})],1)],1)]),t._v(" "),i("mu-dialog",{attrs:{title:"Dialog",width:"360",transition:"slide-bottom",fullscreen:"",open:t.openDialog},on:{"update:open":function(e){t.openDialog=e}}},[i("mu-text-field",{attrs:{"multi-line":"",rows:4,icon:"comment",placeholder:"Input Reply Message","full-width":""},model:{value:t.msg,callback:function(e){t.msg=e},expression:"msg"}}),i("br"),t._v(" "),i("mu-button",{attrs:{slot:"actions",flat:"",color:"primary"},on:{click:t.replyMsg},slot:"actions"},[t._v("Reply")]),t._v(" "),i("mu-button",{attrs:{slot:"actions",flat:"",color:"primary"},on:{click:t.cancel},slot:"actions"},[t._v("Cancel")])],1)],1)},staticRenderFns:[]},k=i("VU/8")(y,I,!1,null,null,null).exports,x=(Object,{data:function(){return{}},props:{message:{type:Object}},computed:{isInBound:function(){return this.message.inBound}}}),S={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"chatBox"},[t.isInBound?t._e():i("mu-row",{attrs:{gutter:""}},[i("mu-col",{attrs:{span:"2"}},[i("mu-flex",{staticClass:"authorBox",attrs:{direction:"column","justify-content":"center","align-items":"center"}},[i("mu-avatar",{attrs:{color:"indigo"}},[i("mu-icon",{attrs:{value:"account_circle"}})],1),t._v(" "),i("div",[t._v(t._s(t.message.SocialMediaMessageAuthor))])],1)],1),t._v(" "),i("mu-col",{attrs:{span:"8",direction:"column","justify-content":"center"}},[i("div",{staticClass:"textBox outBound"},[t._v(t._s(t.message.Text))])])],1),t._v(" "),t.isInBound?i("mu-row",{attrs:{gutter:""}},[i("mu-col",{attrs:{span:"10","justify-content":"center","align-items":"start"}},[i("div",{staticClass:"textBox inBound"},[t._v(t._s(t.message.Text))])]),t._v(" "),i("mu-col",{attrs:{span:"2"}},[i("mu-flex",{staticClass:"authorBox",attrs:{direction:"column","justify-content":"center","align-items":"center"}},[i("mu-avatar",{attrs:{color:"indigo"}},[i("mu-icon",{attrs:{value:"account_circle"}})],1),t._v(" "),i("div",[t._v(t._s(t.message.SocialMediaMessageAuthor))])],1)],1)],1):t._e()],1)},staticRenderFns:[]};var $=i("VU/8")(x,S,!1,function(t){i("9qAM")},"data-v-2bb07c90",null).exports,T=(Array,{data:function(){return{}},props:{interaction:{type:Array}},components:{ChatModule:$}}),O={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",this._l(this.interaction,function(t){return e("div",{key:t.ID},[e("chat-module",{attrs:{message:t}})],1)}))},staticRenderFns:[]},P=i("VU/8")(T,O,!1,null,null,null).exports,M={data:function(){return{ticketDetail:{ServiceRequestLocation:{}},interactionHistory:[{SocialMediaMessageAuthor:"C4C",Text:"reply from c4c",inBound:!1},{SocialMediaMessageAuthor:"WeChat",Text:"reply in WeChat",inBound:!0},{SocialMediaMessageAuthor:"C4C",Text:"reply from c4c",inBound:!1},{SocialMediaMessageAuthor:"C4C",Text:"reply from c4c",inBound:!1},{SocialMediaMessageAuthor:"WeChat",Text:"reply in WeChat",inBound:!0}],componentId:"DetailComponent"}},components:{DetailComponent:k,InteractionComponent:P},computed:{ticketID:function(){return this.$route.params.id},wxCode:function(){return this.$route.query.code},interactionPath:function(){return"/TicketDetail/InteractionHistory/"+this.ticketDetail.SocialMediaActivityID},detailPath:function(){return"/TicketDetail/"+this.ticketDetail.ID}},methods:{},mounted:function(){var t=this,e=this.$loading();this.openID=this.common.getOpenID(this.wxCode),this.$axios({method:"post",url:this.CONFIG.url.getTicket,data:{ID:this.ticketID}}).then(function(i){e.close(),console.log(i.data),200==i.status&&(t.ticketDetail=i.data)})}},L={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"mainContent"},[i(t.componentId,{tag:"component",staticClass:"listContent",attrs:{detail:t.ticketDetail,interaction:t.interactionHistory}}),t._v(" "),i("mu-bottom-nav",{staticClass:"tabBar",attrs:{value:t.componentId},on:{"update:value":function(e){t.componentId=e}}},[i("mu-bottom-nav-item",{attrs:{title:"Detail",icon:"details",value:"DetailComponent"}}),t._v(" "),i("mu-bottom-nav-item",{attrs:{title:"History",icon:"history",value:"InteractionComponent"}})],1)],1)},staticRenderFns:[]};var R=i("VU/8")(M,L,!1,function(t){i("8O15")},"data-v-f775b9d6",null).exports,w=i("9re4");n.a.use(a.a);var B=new a.a({mode:"history",routes:[{name:"SocialMediaActivityCreate",path:"/SocialMediaActivityCreate",component:d},{name:"ContactCollection",path:"/ContactCollection",component:f},{name:"TicketList",path:"/TicketList",component:D},{name:"TicketDetail",path:"/TicketDetail/:id",component:R},{name:"InteractionHistory",path:"/TicketDetail/InteractionHistory/:id",component:w.default}]}),N=i("mtWM"),F=i.n(N),j=i("aFc6"),A=(i("E51W"),i("1kwf")),q=(i("0Y+k"),i("sXio")),U=i("w7Ps"),W=i("mrgY"),E=i.n(W);const H=i("mrgY"),V=i("mtWM");var G={getOpenID:t=>new Promise((e,i)=>{V({method:"post",url:H.url.getOpenID,data:{code:t}}).then(t=>{e(t.data)})})};n.a.use(j.a),n.a.use(A.a),n.a.use(q.a),n.a.use(U.a),n.a.use(r.a),n.a.config.debug=!0,n.a.config.productionTip=!1,F.a.defaults.baseURL="api/",n.a.prototype.$axios=F.a,n.a.prototype.CONFIG=E.a,n.a.prototype.common=G,new n.a({el:"#app",router:B,template:"<App/>",components:{App:o}})},mrgY:function(t,e,i){const n=Object.is("production","production"),s=n?"https://c4codatasample.cfapps.us10.hana.ondemand.com":"http://localhost:4000",o={createTicket:s+"/createTicket",createBP:s+"/createBP",getContactCollection:s+"/getContactCollection",wxConfig:s+"/wxJssdk/getJssdk",getTicket:s+"/getTicket",getTicketList:s+"/getTicketList",replyMsg:s+"/replyMsg",getSMUP:s+"/getSMUP",getOpenID:s+"/getOpenID"};t.exports={baseUrl:n?"https://c4codatasample.cfapps.us10.hana.ondemand.com":"api/",url:o}}},["lVK7"]);
//# sourceMappingURL=app.34389dda71c7b68ff0d8.js.map