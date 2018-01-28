#!/usr/bin/env node

var express = require("express");
var app = express();
var fs = require("fs");
var https = require("https");
var path = require("path");

var server = https.createServer({
    key: fs.readFileSync("/etc/letsencrypt/live/hackescape.westeurope.cloudapp.azure.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/hackescape.westeurope.cloudapp.azure.com/fullchain.pem")
}, app);

server.listen(443);

app.use('/', express.static(path.join(__dirname, "web")));

console.info("Server on port 443");
