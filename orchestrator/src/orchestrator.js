#!/usr/bin/env node
"use strict";

require('@babel/polyfill');
const { 
  startValidator, 
  stopValidator,
  startSync,
  stopSync } = require('./docker');
const { 
  getLeader, 
  setLeader } = require('./chain');

const {
    PRIVATE_KEY,
    ARCHIPEL_CONTRACT_ADDRESS,
    NODE_URL
  } = process.env


  /*
   demo chain.js usage gist : 
    let initialLeader = await getLeader(ARCHIPEL_CONTRACT_ADDRESS,NODE_URL);
    console.log(initialLeader);
    const newLeader = await setLeader(PRIVATE_KEY,ARCHIPEL_CONTRACT_ADDRESS,NODE_URL);
    console.log(newLeader);
  */

async function main() {
    

    const name = "test-one-new";
    const key = "0xa40f0300247dc7ed20bc3f9862b43bc9011fce342e2699d3d083c4d090dcd263";

    console.log(await startValidator(name, key));
    
}

main();