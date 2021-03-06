#!/usr/bin/env node
"use strict";

const Debug = require('debug');
require('@babel/polyfill');
const { 
  startValidator, 
  startSync 
} = require('./docker');

const { 
  getLeader, 
  setLeader 
} = require('./chain');

const {
  sleep,
} = require('./utils');


const debug = Debug('orchestrator:docker');

const {
  pingEndpoints
} = require('./ping');

const {
    PRIVATE_KEY,
    ETH_ADDRESS,
    ARCHIPEL_CONTRACT_ADDRESS,
    NODE_URL,
    VALIDATOR_NAME,
    VALIDATOR_KEY,
    HOSTS_TO_PING,
    HOSTS_WALLETS
  } = process.env

let disconnect = false;

const orchestrate = async () => {

  try {
    // Converting string into arrays
    const hostsToPingArray = HOSTS_TO_PING.split(" ");
    const walletsArray = HOSTS_WALLETS.split(" ");
    
    // If the last known state was disconnect sleeping for 5 sec
    if (disconnect) {
      await sleep(5000);
      disconnect = false;
    }

    console.log("Making pings to endpoints...");
    const pingResult = await pingEndpoints(hostsToPingArray);

    console.log(pingResult);
  
    const failPings = pingResult.filter(element => element.reachable == false);

    // If the node fails to ping all other nodes and external node so it is down
    if (failPings.length == HOSTS_TO_PING.split(" ").length) {

      console.log("Can't ping anyone. Change to sync.");
      await startSync(VALIDATOR_NAME);
      disconnect = true;

    } else {

      // Get current leader
      let currentLeader = await getLeader(ARCHIPEL_CONTRACT_ADDRESS, NODE_URL);

      console.log(currentLeader);
      console.log(ETH_ADDRESS);

      // If there is no current leader the node will propose himself
      if (currentLeader == "0x0000000000000000000000000000000000000000") {

        const leadeshipChanged = await setLeader(PRIVATE_KEY, ARCHIPEL_CONTRACT_ADDRESS, NODE_URL, "0x0000000000000000000000000000000000000000");

        // If the node changed the leadership it becomes the new validator node
        if (leadeshipChanged) {
          await startValidator(VALIDATOR_NAME, VALIDATOR_KEY);
        } 

      // If the node is the current leader assuring that the validator is strated
      } else if (currentLeader == ETH_ADDRESS) {

        console.log("Staring validator node");
        await startValidator(VALIDATOR_NAME, VALIDATOR_KEY);

      } else {

        console.log("Staring sync node");
        await startSync(VALIDATOR_NAME);

        // Get ping of current validator
        const leaderIndex = walletsArray.indexOf(currentLeader);

        console.log("Leader index " + leaderIndex);

        // If validator is not reachable the node will try to become the validator
        if (leaderIndex == -1 || !pingResult[leaderIndex].reachable) {

          console.log("Validator is not reachable. Starting validator node");
          const leadeshipChanged = await setLeader(PRIVATE_KEY, ARCHIPEL_CONTRACT_ADDRESS, NODE_URL, currentLeader);
          
          // If the node changed the leader it starts validator
          if (leadeshipChanged) {
            await startValidator(VALIDATOR_NAME, VALIDATOR_KEY);
          }
          
        }
      }
    }

  } catch (error) {
    debug('checkState', error);
    throw error;
  }
};

module.exports = {
  orchestrate,
};
