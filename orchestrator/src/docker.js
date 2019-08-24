const Docker = require('dockerode');
const Debug = require('debug');
const {
    throwIfMissing,
} = require('./utils');

const debug = Debug('orchestrator:docker');
const docker = new Docker({socketPath: '/var/run/docker.sock'});

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


const startContainer = async (
    data = throwIfMissing(),
) => {

    try {

        await docker.pull(data.Image, function(err, stream) {
            docker.modem.followProgress(stream, onFinished, onProgress);
          
            function onFinished(err, output) {
                docker.createContainer(data).then(function(container) {
                    return container.start();
                });
            }
            function onProgress(event) {
              //
            }
          });

    } catch (error) {
        debug('startContainer', error);
        throw error;
    }

};

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
            console.log("Volume already exsits.");
            return false;
        }
    } catch (error) {
        debug('startValidator', error);
        throw error;
    }

};


const startValidator = async () => {
    try {

        await createVolume();

        const container = await getContainerByName('polkadot-validator');
        const containerSync = await getContainerByName('polkadot-sync');

        if (container == undefined && containerSync == undefined) {

            const data = {
                    name: 'polkadot-validator',
                    Image: 'chevdor/polkadot:0.4.4',
                    Cmd: ['polkadot', '--name', 'test_one', '--validator', '--key', '0xa40f0300247dc7ed20bc3f9862b43bc9011fce342e2699d3d083c4d090dcd263'],
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

const startSync = async () => {
    try {

        await createVolume();
        
        const container = await getContainerByName('polkadot-sync');
        const containerValidator = await getContainerByName('polkadot-validator');
        if (container == undefined && containerValidator == undefined) {
            const data = {
                    name: 'polkadot-sync',
                    Image: 'chevdor/polkadot:0.4.4',
                    Cmd: ['polkadot', '--name', 'test_one'],
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