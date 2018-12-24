# Welcome to C4C Agent Server Accelerator Build and Deploy Guide

This document provides you an example to connect SAP Cloud for Customer (C4C) tenant and WeChat based on a B2B service integration scenario

**Note: In actual procductive development, you can choose variety of cloud platforms for Agent Server deployment, in C4C Agent Server Accelerator we use SAP Cloud Platform(SCP) as a reference**

## Bussiness Backgound

Assume your company is dealing with business customers. Your customers can associate the WeChat account with contact of account, and then directly create Cloud for Customer service tickets from WeChat, they can have asynchronized social interaction with the service agent from the WeChat about the tickets they have created.  Your service agents can also give asynchronized respond to WeChat from Cloud for Customer service ticket.
The C4C Agent Server Accelerator project implemented 5 functions to complete the whole scenarion:
- Create SocialMediaUserProfile(SMUP) via WeChat openID and associate with C4C Contact as BP
- Create SociaMediaActivity(SMA) and Ticket via WeChat
- Check Ticket List and Ticket Detail
- Check Social Interaction about ticket
- Send and recieve message about ticket via WeChat

## Prerequisites
- Build up an intermediary app server, AKA Agent Server, this server is to process logic handling about WeChat between C4C.

*Note: the scenario in this case is based on OData Service*
- Registere an account of any Cloud Platform, for example, in this project, we use **Productive Account** of SAP Cloud Platform(SCP). Cloud Platform is the place where you deploy your Agent Server.
- SAP Cloud for Customer (C4C) tenant.
- For C4C User:
    - Admin access to an SCP account
    - C4C admin user
- Register a WeChat Official Account with Subsciption Account type from WeChat Open Platform.
- The related API should have been provided by C4C.


##Integration Process
###1. Flow Chart
###2. Process Description
- User follow WeChat Official Account, open Contact Page, enter Contact's phone number, if there is Contact according to the phone number, create SocialMediaUserProfile using WeChat User's information and associate Contact as BusinessPartner(BP).
- User create tickets via WeChat Official Account. Agent Server will firstly create SocialMediaActivity(SMA) with an empty ticket and then update tiket information.
- Once ticket created successfully, User will recieve notification, click noticication will navigate to Ticket Detail Page and see ticket's detail.
- Administrator replies ticket in C4C. The message will firstly be pushed to Agent Server and then be forwarded to User.
- User enter Ticket Detail Page and click 'InteracrionLog' tab, Agent Server will get all child SocialMediaActivity bounded in the root SocialMediaActivity and response to WeChat.
###3. Development List
- Development of Agent Server
- H5 Page of Official Account
- Interface Configuration of C4C
###4. Configure in C4C
- Create Mashup Service
Mashup Service is used to interaction with the Agent Server, for example, sending message to Agent Server when Administrator reply for ticket.
- Create New Channel with typr "WeChat"
This channel is the representation of related official account in C4C.
Please follow the below steps:
    - Navigate to Administrator Service and Social Settings Social Media Channels.
    - Click New.
    - Select WeChat as the  Social Media Channel.
    - Enter the Mashup Service ID that you have created for the response.(please enter the ID, do not copy and paste)
    - Enter your Channel ID, Channel Name.
    - Save your options.
###5. Implementation
To build the intermediary server, take SCP for example. First, regarding how to build a node server in SCP, follow this help document. The following explains the main logic should be implemented in node server.
####5.1 Key OData Service Introduction
We provide standard OData service in C4C which contains several entities: *https://<host_url>/sap/c4c/odata/v1/c4codataapi*

Developer could handle CURD request with: *https://<host_url>/sap/c4c/odata/v1/c4codataapi/entityCollection*
For more detail about how to use OData Service, please refer to the two guides below:
[OData API Developer's Guide](https://github.com/SAP/C4CODATAAPIDEVGUIDE)、 [OData Service in C4C](https://wiki.wdf.sap.corp/wiki/display/APPLMPRO/ODATA+Services+in+C4C)

in this case, there are 3 key OData Services are used:
- SocialMediaUserProfileCollection
   - To create a SMUP with Contact as BP, by posting payload:
```
{
	"SocialMediaUserCategoryCode":"02",
	"SocialMediaUserProfileUserInformation":[{
		"SocialMediaChannelCode":"001",
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
*https://<host_url>/sap/c4c/odata/v1/c4codataapi/GetSocialMediaUserProfile?<PropertyName>='<PropertyValue>'*
By calling this query, C4C will return the SMUP node back.

- SocialMediaActivityCollection
    - When create ticket, please create a SMA at first, to Create a SMA, by posting payload:
```
{
	"CategoryCode":"001",
	"SocialMediaMessageAuthor": WeChat NickName,
	"SocialMediaChannelCode":"008",
	"SocialMediaMessageID": Generate randomly,
	"InitiatorCode":"2",
	"SocialMediaUserProfileUUID":SMUP's ObjectID,
    "Text": problem discription of ticket,
    "SocialMediaActivityProviderID":Channel ID(in previous step created)
}
```
C4C will create a SMA and an empty ticket at the same time, after SMA create successfully, C4C will return SMA node.
    - All the messages about the ticket, will be child SMA bounded to the Root SMA which is created with ticket. To get social interactions, you can call the query refer to the below url pattern:
*https://<host_url>/sap/c4c/odata/v1/c4codataapi/GetAllChildSocialMediaActivity?RootSocialMediaActivityNodeID='<RootSMAObjectID>'*

*Note: the returning data didn't sort*
- ServiceRequestCollection
    - Using SMA ID and typecode "1067" as filter, call ServiceRequest's subnode ServiceRequestBusinessTransactionDocumentReference, C4C will return ServiceRequestBusinessTransactionDocumentReference node, the property ```ParentObjectID``` is the empty ticket's Object ID.
Update ticket by PATCH ticket infomation to ServiceRequestCollection.
    - If you want to get SMA node by using ticket node, for example, if you know the ticket's ObjectID, firstly you need to get ServiceRequestBusinessTransactionDocumentReference bounded in the ticket, then filter node with typecode equals to "1067", the SMA ID will be the node ID.

**Node: the payload only listed key property that required by back-end, for different product requirement, please refer to $metadata for entity's full api**

####5.2 WeChat Official Account Configure
Indroduce necessary configuration logic handling between WeChat with Agent Server, for more detail, please refer to [WeChat Official Account Development Guide](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1445241432)
- Handle *access_token* of official account API
The access_token is necessary, it will be used when calling WeChat API.
Developer need to get the token via link: 
`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET`
Each token will be expired in 2 hours. If the new token is generated, old one will be expired at once. In order to avoid multiple users refresh token at the same time to cause the token expired again and again, we suggests that the token should be stored                        in server and refreshed every 2 hours. All the users get the token from server.

- Validate the WeChat official account server
In the administration page of official account, complete the configuration as below:
When the configuration is saved, WeChat server will post the token and some other parameters to the configured path ‘/wechat’ with http get mode. In the intermediary server, the same token will be encrypted and compared with the signature to implement the connection.
The parameters received by Agent Server are as below: `token/timestamp/nonce/signature`.
    - Sort ‘token’, timestamp’, ‘nonce’ in lexicographical order;
    - Concatenate the three parameters into string and complete Algorithm encryption;
    - Compare the encrypted string with signature to identify the request is from WeChat official account.

- Generate the customized user menu in official account
Call the API of WeChat official account with POST mode ( use https as protocol)
`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN`
`ACCESS_TOKEN`is the token stored in server in previous steps. 
Detail please refer to[WeChat Official Account Development Guide](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1445241432)


## Project Description
This project contains two parts, Front-End(H5 Page) and Back-End(Agent Server).
The technical stack using for this project is: `Vue.js + Nodejs`.
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
Path|Page
----|----
/SocialMediaActivityCreate| Ticket Create Page
/ContactCollection| Create SMUP with BP
/TicketList| Ticket List Page
/TicketDetail/:id| Ticket Detail Page

- How to Deploy(Production)
1. Build Front File in Production
    ```bash
    cd Front-End
    npm run build
    ```
2. Copy files in `Front-End\dist` into `Back-End\views`
3. Upload Back-End file into Cloud Platform

*Please follow these steps every time you want to deploy Agent Server into Cloud Platform*

##Disclaimer
Any software coding and/or code snippets are examples. They are not for productive use. The example code is only intended to better explain and visualize the syntax and phrasing rules. SAP does not warrant the correctness and completeness of the example code. SAP shall not be liable for errors or damages caused by the use of example code unless damages have been caused by SAP's gross negligence or wilful misconduct.

