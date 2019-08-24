const isReachable = require('is-reachable');

const pingEndpoints = async (endpointsList) => {
    var pingEndpointsResult = [];
    for(let endpoint of endpointsList)
    {
        let reachable = await isReachable(endpoint);
        pingEndpointsResult.push({endpoint:endpoint,reachable:reachable})
    }
    return pingEndpointsResult;
};

module.exports = {
    pingEndpoints
};