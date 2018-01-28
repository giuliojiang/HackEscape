#!/usr/bin/env node

var path = require("path");
const express = require('express')
const app = express()

app.use('/', express.static(path.join(__dirname, "redirect")));

app.listen(80, () => console.log('Example app listening on port 80!'))
