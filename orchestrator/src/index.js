#!/usr/bin/env node
"use strict";
require('@babel/polyfill');
const { 
    checkState 
} = require('./orchestrator');

const {
    PRIVATE_KEY,
    ARCHIPEL_CONTRACT_ADDRESS,
    NODE_URL
} = process.env

async function main() {
    setInterval(checkState, 3000);
};

main();
