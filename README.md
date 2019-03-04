# Welcome to C4C Agent Server Accelerator Build and Deploy Guide

This document gives you an example of connecting SAP Cloud for Customer (C4C) tenant with WeChat based on a B2B service integration scenario

**Note: In production environment, you can choose variety of cloud platforms for Agent Server deployment, in C4C Agent Server Accelerator we use SAP Cloud Platform(SCP) as a reference**
## Business Background

Let’s assume your company needs to deal with business customers. The business customer can associate the WeChat account with the contact of account, and then directly create Cloud for Customer service tickets from WeChat. They can have asynchronized social interaction with the service agent from the WeChat about the tickets they have created.  Your service agents can also give asynchronized respond to WeChat from Cloud for Customer service ticket.
The C4C Agent Server Accelerator project implemented 5 functions to complete the whole scenarion:
- Associate WeChat User with C4C Contact, which means:
    - SocialMediaUserProfile (SMUP) is created via WeChat openID
    - SMUP is associated with contact as BusinessPartner (BP), which means, the contact is stored as sub-node 'SocialMediaUserProfileBupaReference' in the root-node 'SocialMediaUserProfile'
- Create and the ticket via WeChat, which means:
    - SociaMediaActivity (SMA) is created.
- Check the ticket list and the ticket detail.
- Check Social Interaction about the ticket.
- Send and receive messages about the ticket via WeChat.
- Revieve survey message and link from C4C.

## Prerequisites

- Build up an intermedia app server, which is also called Agent Server. This server is to process logic handling between WeChat with C4C.

*Note: the scenario in this case is based on OData Service*
- Register an account in any Cloud Platform, for example, in this project, we use **Productive Account** of SAP Cloud Platform(SCP). Cloud Platform is the place where you deploy your Agent Server.
- SAP Cloud for Customer (C4C) tenant.
- For C4C user:
    - Admin access to an SCP account
    - C4C admin user
- Register a WeChat Official Account with Subscription Account type from WeChat Open Platform.
- The related API should have been provided by C4C.
## Integration Process

### 1. Process Description
1.	Users follow WeChat Official Account, open Contact Page, and enter Contact's phone number. In this case, we use phone number to filter. You can choose other property as filter or add a SMS configuration for higher sercurity.
    - If there is Contact exists in C4C with the provided phone number, the system creates SocialMediaUserProfile using WeChat User's information as a root-node and create a sub-node to associate Contact as BusinessPartner (BP).
2.	Users create tickets via WeChat Official Account. Users can choose whether to enter product information(SerialID and ProductID) or not.
    - If users enter SerialID, which means the product is Registered Product, users are required to enter ProductID at the same time. Agent Server will verify the authorization of the registered product and compare ProductID user entered with the registered product. If users enter just ProductID, which means the product is Normal Product. Agent Server will verify whether the product is existed.
    - Agent Server creates SocialMediaActivity (SMA) with an empty ticket and then update ticket information.
3.	Once ticket is created successfully, the users will receive a notification. After users click the notification, they will be navigated to Ticket Detail Page to see ticket's details.
4.	Service agent replies ticket in C4C.
    - The message will be pushed to Agent Server and then be forwarded to the user. Agent Server will use SMA ID to get the associated ticket, and then use the 'BuyerMainContactPartyID' property as contact ID to query SMUP and then send message to the SMUP.(This process is to prevent if ticket changes contact person, which means after changing, the new SMUP will recieve the notification about the ticket instead of the old one).
5.	Users enter Ticket Detail Page and click 'InteractionLog' tab.
    - Agent Server will get all child SocialMediaActivity bounded in the root SocialMediaActivity and respond to WeChat.
6. If there is survet workflow rules relates to the ticket, once the rule has excuted.
    - Agent Server will revcieve the formatted JSON data and send a text notification includes survey message and survey link to user.

### 2. Development List
- Development of Agent Server
- H5 Page of Official Account
- Interface Configuration of C4C
### 3. Configure in C4C
- Create Mashup Service
Mashup Service is used to interact with the Agent Server, for example, sending message to Agent Server when Administrator replies a ticket.
    1. Navigate to Administrator Service
    2. Click Business Flexibility->Mashup Web Services
    3. Click New->REST Service
    4. Enter Service Name, Select 'POST' as HTTP Method,'Form' as Content Type.
    5. Enter URL(`<Your cloud server address> + API`, E.g. https://xxxxxxxxxx.com/wechat/c4c)
    6. Save your options.
- Create New Channel with type "WeChat"
This channel is the representation of related official account in C4C.
Please follow the steps below:
    1. Navigate to Administrator Service and Social Settings Social Media Channels.
    2. Click New.
    3. Select WeChat as the  Social Media Channel.
    4. Enter the Mashup Service ID that you have created for the response.(Please enter the ID, do not copy and paste)
    5. Enter your Channel ID and Channel Name.
    6. Save your options.
### 4. Implementation
To build the intermediary server, let's take SCP for example. First, regarding how to build a node server in SCP, follow this [help document](https://cloudplatform.sap.com/try.html). The followings explain the main logic which should be implemented in node server.
#### 4.1 Key OData Service Introduction
We provide standard OData service in C4C which contains several entities: *https://<host_url>/sap/c4c/odata/v1/c4codataapi*

Developer could handle CURD request with: *https://<host_url>/sap/c4c/odata/v1/c4codataapi/entityCollection*
For more detail about how to use OData Service, please refer to the two guides below:
[OData API Developer's Guide](https://github.com/SAP/C4CODATAAPIDEVGUIDE)、 [OData Service in C4C](https://wiki.wdf.sap.corp/wiki/display/APPLMPRO/ODATA+Services+in+C4C)

In this case, there are 3 key OData Services are used:
##### 4.1.1 SocialMediaUserProfileCollection
- To create a SMUP with Contact as BP, by posting payload:
```JSON
{
	"SocialMediaUserCategoryCode":"02",
	"SocialMediaUserProfileUserInformation":[{
		"SocialMediaChannelCode":"008",
		"ExternalPartyAccountID": Channel ID(in previous step created),
		"SocialMediaUserAccountID":WeChat OpenID,
		"SocialMediaUserName":WeChat Nickname
	}],
	"SocialMediaUserProfileBupaReference":[{
		"BusinessPartnerCategoryCode":"1",
		"BusinessPartnerRoleCode":"BUP001",
		"BusinessPartnerUUID":Contact's ObjectID
	}]
}
```
Contact will be a subnode `SocialMediaUserProfileBupaReference` bound with SMUP

- To filter SMUP by specific property, for example, if you want to filter SMUP by using property: `SocialMediaUserAccountID`, please do not use OData Service's origin system query options `$filter`.
Using `GetSocialMediaUserProfile` instead. For the query format, please refer to the below url pattern:

`https://<host_url>/sap/c4c/odata/v1/c4codataapi/GetSocialMediaUserProfile?<PropertyName>='<PropertyValue>'`

By calling this query, C4C will return the SMUP node back.
##### 4.1.2 SocialMediaActivityCollection
- When create ticket, please create a SMA at first, to Create a SMA, by posting payload:

```JSON
{
	"CategoryCode":"001",
	"SocialMediaMessageAuthor": WeChat NickName,
	"SocialMediaChannelCode":"008",
	"SocialMediaMessageID": randomly generate,
	"InitiatorCode":"2",
	"SocialMediaUserProfileUUID":SMUP's ObjectID,
    "Text": problem discription of ticket,
    "SocialMediaActivityProviderID":Channel ID(in previous step created)
}
```

C4C will create a SMA and an empty ticket at the same time. After SMA is created successfully, C4C will return SMA node.

- All the messages about the ticket, will be child SMA bounded to the Root SMA which is created with ticket. To get social interactions, you can call the query. Refer to the following URL pattern:
`https://<host_url>/sap/c4c/odata/v1/c4codataapi/GetAllChildSocialMediaActivity?RootSocialMediaActivityNodeID='<RootSMAObjectID>'`

*Note: the returning data didn't sort*
##### 4.1.3 ServiceRequestCollection
- Using SMA ID and typecode "1067" as filters, call ServiceRequest's sub-node ServiceRequestBusinessTransactionDocumentReference, C4C will return ServiceRequestBusinessTransactionDocumentReference node, the property ```ParentObjectID``` is the empty ticket's Object ID.
Update ticket by PATCH ticket infomation to ServiceRequestCollection.
    - If you want to get SMA node by using ticket node, for example, if you know the ticket's ObjectID, firstly you need to get ServiceRequestBusinessTransactionDocumentReference bounded in the ticket, and then filter node with typecode equals to "1067", the SMA ID will be the node ID.

**Node: the payload only lists the key property which is required by back-end. For different product requirement, please refer to $metadata for entity's full api**

##### 4.1.4 RegisteredProductCollection&ProductCollection
- For Registered Product, use SerialID as filter to query the registered product node and expand sub-node'RegisteredProductPartyInformation', compare property 'ContactPartyID' of sub-node'RegisteredProductPartyInformation' with SMUP's ContactID as authoration verifivation and compare property 'ProductID' of root-node with entered ProductID. These two steps are required when create ticket.
- For Normal Product, use ProductID as filter to query product node.

#### 4.2 WeChat Official Account Configuration
This section indroduces necessary configuration logic handling between WeChat and Agent Server, for more details, please refer to [WeChat Official Account Development Guide](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1445241432)
- Handle *access_token* of official account API
The access_token is necessary, it will be used when calling WeChat API.
Developers need to get the token via link:
`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET`
Each token will be expired in 2 hours. If the new token is generated, the old one will be expired at once. In order to avoid multiple users refreshing token at the same time which will cause the token expired again and again, we suggest that the token should be stored in server and to be refreshed every 2 hours. All the users get the token from Agent Server.

- Validate the WeChat official account server
In the administration page of official account, complete the configuration as below:
When the configuration is saved, WeChat server will post the token and some other parameters to the configured path ‘/wechat’ with http get mode. In the intermediate server, the same token will be encrypted and compared with the signature to implement the connection.
The parameters received by Agent Server are as below: `token/timestamp/nonce/signature`.
    - Sort ‘token’, timestamp’, ‘nonce’ in lexicographical order;
    - Concatenate the three parameters into string and complete Algorithm encryption;
    - Compare the encrypted string with the signature to identify if the request is from WeChat official account.

- Generate the customized user menu in official account
Call the API of WeChat official account with POST mode ( use https as protocol)
`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN`
`ACCESS_TOKEN`is the token stored in server in previous steps.
For details, please refer to[WeChat Official Account Development Guide](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1445241432)

#### 4.3 C4C Mashup Web Service Handle
The mashup service is needed for both sending ticket reply and survey message to WeChat Agent Server.
- For survey workflow, the JSON data sending from mashup service is like:
```JSON
{
    "type":"WKF",
    "data":[{
        "openId":"WeChat OpenID",
        "fullText":"THIE IS SURVEY LINK #SURVEY2041#. PLEASE FILL THE FORM.",
        "surveyLink":"https://surveylink"
        }]
}
```
By using the flag 'WKF' to identify the message type is survey message. The survey's link is filled in `surveyLink`(It is optional, wether the hyperlink is filled will depend on user's configure in C4C System). For detail, please refer to the wiki page:[WeChat Integration with C4C Workflow](https://wiki.wdf.sap.corp/wiki/display/C4CCNCTU/WeChat+Integration+with+C4C+Workflow).
- For C4C ticket reply to WeChat, the JSON data is like:
```JSON
{
    "content": 
        '{
            "original_id":"",
            "sma_id":"message id",
            "service_req_no":"ticket id",
            "author_name":"author name",
            "author_email":"",
            "sma_create_datetime":"2019-03-04T03:31:27Z",
            "private_ind":"FALSE",
            "text":"text"
            }'
}
```
For the ticket reply, we will use ticket ID to get the `BuyerMainContactPartyID`, which is the contact you linked with your SMUP, and use the `BuyerMainContactPartyID` as `BusinessPartnerInternalID` to get SMUP'S `SocialMediaUserAccountID`, this is the user the message will send.

## Project Description

This project contains two parts, Front-End(H5 Page) and Back-End(Agent Server).
The technical stack usedw for this project is: `Vue.js + Nodejs`.
- How to Run(Local)
1. Clone the whole project into local
2. For Front-End:
    ```bash
    cd Front-End

    #install the dependency module
    npm install

    #Font-End Server will run at localhost:8080
    npm start

    ```
3. For Back-End:
    ``` bash
    cd Back-End

    #install the dependency module
    npm install

    #Back-End server will run at localhost:4000
    nodemon index.js
    ```
4. Open Google Chrome(with web-security disabled), run http://localhost:8080 with the path below

|Path|Page|
|-|-|
|/SocialMediaActivityCreate| Ticket Create Page|
|/ContactCollection| Create SMUP with BP|
|/TicketList| Ticket List Page|
|/TicketDetail/:id| Ticket Detail Page|

- How to Deploy(Production)
1. Build Front File in Production
    ```bash
    cd Front-End
    npm run build
    ```
2. Copy files in `Front-End\dist` into `Back-End\views`
3. Upload Back-End file into Cloud Platform

*Please follow these steps every time you want to deploy Agent Server into Cloud Platform*
## Disclaimer

Any software coding and/or code snippets are examples. They are not for productive use. The example code is only intended to better explain and visualize the syntax and phrasing rules. SAP does not warrant the correctness and completeness of the example code. SAP shall not be liable for errors or damages caused by the use of example code unless damages have been caused by SAP's gross negligence or wilful misconduct.

