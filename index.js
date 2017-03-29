'use strict';

//var React = require('public/jspm_packages/npm/react');
//npm i koa koa-router koa-static koa-bodyparser nodemon -S
/*
 *  
 *(1)   const koa = require('koa');
 *      let app = new koa();
 *
 *      
 *(2)   let app = require('koa')();
 *
*/

//import React from 'react';
//import ReactDOM from 'react-dom';

let util = require('util');

let app = require('koa')(),
    //router = require('koa-router')(),
    serve = require('koa-static'),
    bodyparser = require('koa-bodyparser');

//console.log('__dirname:', __dirname);
//let router = require('./routeFolder/routes');
let chat = require('./routeFolder/chat');

app.use(bodyparser());
app.use(serve(__dirname + '/public'));

app.use(chat.router.routes())
    .use(chat.router.allowedMethods());

let server = require('http').Server(app.callback());

chat.initialize(server);

server.listen(3000).timeout = 0;