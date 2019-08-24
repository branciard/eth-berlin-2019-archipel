const { Docker } = require('node-docker-api');

const showContainers = async () => {
    try {

        const docker = new Docker({ socketPath: '/var/run/docker.sock' });
        const containers = await docker.container.list();

        return containers;
      } catch (error) {
        debug('showContainers()', error);
        throw error;
      }
};

module.exports = {
    showContainers,
  };