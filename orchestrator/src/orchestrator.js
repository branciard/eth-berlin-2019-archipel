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
    
    console.log(await startValidator());

    console.log(await stopValidator());

    console.log(await startSync());
    
}

main();