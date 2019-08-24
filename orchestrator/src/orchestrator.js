#!/usr/bin/env node

require('@babel/polyfill');
const { showContainers } = require('./docker');

async function main() {
    
    const containers = await showContainers();

    console.log(containers);

}

main();
