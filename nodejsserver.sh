#!/usr/bin/env node

var path = require("path");
const express = require('express')
const app = express()

app.use('/', express.static(path.join(__dirname, "web")));

app.listen(41001, () => console.log('Example app listening on port 41001!'))
