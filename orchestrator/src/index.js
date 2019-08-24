#!/usr/bin/env node
"use strict";
require('@babel/polyfill');

const { 
    orchestrate 
} = require('./orchestrator');

const {
    sleep,
} = require('./utils');

// Main function
async function main() {
    // Looping and sleeping
    while (true) {
        await orchestrate();
        await sleep(5000);
    }
};

main();
