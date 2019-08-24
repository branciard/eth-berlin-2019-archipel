const Docker = require('dockerode');
const Debug = require('debug');
const {
    throwIfMissing,
} = require('./utils');

const debug = Debug('orchestrator:docker');
const docker = new Docker({socketPath: '/var/run/docker.sock'});

// Gets container instance by name
const getContainerByName = async (
    name = throwIfMissing(),
) => {
    try {
        
        const containers = await docker.listContainers({"all": true});

        var element = containers.find(function(element) {
            if (element.Names[0] == "/" + name){
                return element;
            }
          });

        return element;
      } catch (error) {
        debug('getContainerByName', error);
        throw error;
      }
};

// Gets volume instance by name
const getVolumeByName = async (
    name = throwIfMissing(),
) => {
    try {
        
        const volumes = await docker.listVolumes();
        var element = volumes.Volumes.find(function(element) {
            if (element.Name == name){
                return element;
            }
          });

        return element;
      } catch (error) {
        debug('getContainerByName', error);
        throw error;
      }
};

// Starts container with special config
const startContainer = async (
    data = throwIfMissing(),
) => {

    try {
        // Pulling image
        await docker.pull(data.Image);

        // Starting container
        await docker.createContainer(data).then(function(container) {
            return container.start();
        });

    } catch (error) {
        debug('startContainer', error);
        throw error;
    }

};

// Creating validator volume
const createVolume = async () => {
    try {
        const volume = await getVolumeByName("polkadot-volume");
        
        if (volume == undefined) {
            const options = {
                "Name": "polkadot-volume"
            };
            await docker.createVolume(options);
            return true;
        } else {
            console.log("Volume already exists.");
            return false;
        }
    } catch (error) {
        debug('startValidator', error);
        throw error;
    }

};

// Starting validator node
const startValidator = async (
    name = throwIfMissing(),
    key = throwIfMissing(),
) => {
    try {
        // Creating volume
        await createVolume();

        const container = await getContainerByName('polkadot-validator');
        const containerSync = await getContainerByName('polkadot-sync');

        // If node was in sync state we must stop sync container
        if (containerSync != undefined) {
            await stopSync();
        }

        // If validator was not already started start it
        if (container == undefined) {

            const data = {
                    name: 'polkadot-validator',
                    Image: 'chevdor/polkadot:0.4.4',
                    Cmd: ['polkadot', '--name', name, '--validator', '--key', key],
                    HostConfig: {
                        "Mounts": [
                            {
                               "Target":   "/root/.local/share/polkadot",
                               "Source":   "polkadot-volume",
                               "Type":     "volume", 
                               "ReadOnly": false
                            }
                         ]
                    }
                   
            };

            await startContainer(data);
            return true;
        } else {
            console.log("Node is already started.");
            return false;
        }    
    } catch (error) {
        debug('startValidator', error);
        throw error;
    }

};

// Stopping validator node
const stopValidator = async () => {
    try {

        const containerByName = await getContainerByName('polkadot-validator');
 
        if (containerByName != undefined) {
            const container = await docker.getContainer(containerByName.Id);
            await container.stop();
            await container.remove();
            return true;
        } else {
            console.log("Validator was not found.");
            return false;
        }
    } catch (error) {
        debug('stopValidator', error);
        throw error;
    }

};

// Starting syncronisation node
const startSync = async (
    name = throwIfMissing(),
) => {
    try {
        // Creating volume if necessary
        await createVolume();
        
        const container = await getContainerByName('polkadot-sync');
        const containerValidator = await getContainerByName('polkadot-validator');

        // If the node is in validation state stopping validator
        if (containerValidator != undefined) {
            await stopValidator();
        }

        // If sync node is not launched launching it
        if (container == undefined) {
            const data = {
                    name: 'polkadot-sync',
                    Image: 'chevdor/polkadot:0.4.4',
                    Cmd: ['polkadot', '--name', name],
                    HostConfig: {
                        "Mounts": [
                            {
                               "Target":   "/root/.local/share/polkadot",
                               "Source":   "polkadot-volume",
                               "Type":     "volume", 
                               "ReadOnly": false
                            }
                         ]
                    }
            };
        
            await startContainer(data);
            return true;
        } else {
            console.log("Node was is already started.");
            return false;
        }
    
    } catch (error) {
        debug('startSync', error);
        throw error;
    }
};

// Stopping sync node
const stopSync = async () => {

    try {
        const containerByName = await getContainerByName('polkadot-sync');
        if (containerByName != undefined) {
            const container = await docker.getContainer(containerByName.Id);
            await container.stop();
            await container.remove();
            return true;
        } else {
            console.log("Sync was not found.");
            return false;
        }
    } catch (error) {
        debug('stopSync', error);
        throw error;
    }

};

module.exports = {
    startValidator,
    stopValidator,
    startSync,
    stopSync
};