# C4CODataSampleCode

> this project contains a front-end part and a back-end part
## Build Setup

``` bash
# install dependencies separately in Front-End file and Back-End part
npm install
#Front-End part:
# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

#Back-End part:
# serve with hot reload at localhost:4000
nodemon index.js


# build for production and view the bundle analyzer report
npm run build --report
```
## Development
```bash
Front-End runs in localhost:8080
Back-End runs in localhost:4000
if you are using Google Chrome, please disable web security, and run http://localhost:8080
```

## Production
We use static files for agent server as front end, to deploy an agent server, please follow steps below:
```bash
#1.build production version of front end files
npm run build

#2.copy files after building into Back-End file
copy files in Front-End/dist into Back-End/views

#3.Compress Back-End into zip file, deploy application into SCP
```

