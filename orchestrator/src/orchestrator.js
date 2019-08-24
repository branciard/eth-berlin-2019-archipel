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

const checkState = async () => {
  try {
    console.log("gogo");
  } catch (error) {
    debug('checkState', error);
    throw error;
  }
};


module.exports = {
  checkState,
};