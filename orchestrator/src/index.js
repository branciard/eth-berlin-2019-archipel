#!/usr/bin/env node
"use strict";
require('@babel/polyfill');

const { 
    orchestrate 
} = require('./orchestrator');

const {
    sleep,
} = require('./utils');

async function main() {
    while (true) {
        await orchestrate();
        await sleep(5000);
    }
};

main();
