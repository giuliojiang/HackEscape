#!/usr/bin/env node

const { spawn } = require('child_process');
var path = require('path');

var global_status = "running";

var pull_proc;

var start_pull = function() {
    console.info("Running git pull");
    pull_proc = spawn("git", ["pull"]);

    pull_proc.stdout.on('data', (data) => {
        var splt = data.toString().split('\n');
        for (var i = 0; i < splt.length; i++) {
            console.info(splt[i]);
        }
    });

    pull_proc.stderr.on('data', (data) => {
        var splt = data.toString().split('\n');
        for (var i = 0; i < splt.length; i++) {
            console.info(splt[i]);
        }
    });

    pull_proc.on('close', (code) => {
        console.info("Git pull completed");
        if (global_status == "running") {
            setTimeout(function() {
                start_pull();
            }, 1000 * 60 * 10);
        }
    });
};

var server_proc;

var start_server = function() {
    console.info("Running HTTP server");
    server_proc = spawn(path.join(__dirname, "serve_root.sh"), []);

    server_proc.stdout.on('data', (data) => {
        var splt = data.toString().split('\n');
        for (var i = 0; i < splt.length; i++) {
            console.info(splt[i]);
        }
    });

    server_proc.stderr.on('data', (data) => {
        var splt = data.toString().split('\n');
        for (var i = 0; i < splt.length; i++) {
            console.info(splt[i]);
        }
    });

    server_proc.on('close', (code) => {
        console.info("HTTP server stopped...");
        if (global_status == "running") {
            console.info("Restarting server...");
            setImmediate(function() {
                start_server();
            });
        }
    });
};

start_pull();
start_server();

process.on('SIGINT', function() {
    console.log("HOST: Caught interrupt signal");
    global_status = "stopped";

    server_proc.kill();
    pull_proc.kill();

    setTimeout(() => {
        process.exit(0);
    }, 500);

});
