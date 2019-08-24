const ping = require ("net-ping");

const pingHostPromise = endpoint => new Promise((resolve, reject) => {
    var session = ping.createSession ();
    session.pingHost (endpoint, function (error, target) {
        if (error)
        resolve(false);
        else
        resolve(true);
    });
  });


// Ping a list of hosts and return theirs state
const pingEndpoints = async (endpointsList) => {
    var pingEndpointsResult = [];
    for(let endpoint of endpointsList)
    {
        let reachable= await pingHostPromise (endpoint)
        pingEndpointsResult.push({endpoint:endpoint,reachable:reachable})
    } 
    return pingEndpointsResult;
};

module.exports = {
    pingEndpoints
};