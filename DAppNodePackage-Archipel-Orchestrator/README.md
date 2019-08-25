# DAppNodePackage-Archipel-Orchestrator

Dappnode package providing Archipel Orchestrator
It was generated using [DAppNodeSDK](https://github.com/dappnode/DAppNodeSDK)

No Aragon Package Manager Repo yet.

IPFS link 
```
/ipfs/QmPk2xBHaHbrjYYz7Y5oDpWuNp6sEqpyxkTJ91QQsm7xio
```



Or can use this package without installing it in your DAppNode following these instructions:

## Prerequisites

- git

   Install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) commandline tool.

- docker

   Install [docker](https://docs.docker.com/engine/installation). The community edition (docker-ce) will work. In Linux make sure you grant permissions to the current user to use docker by adding current user to docker group, `sudo usermod -aG docker $USER`. Once you update the users group, exit from the current terminal and open a new one to make effect.

- docker-compose

   Install [docker-compose](https://docs.docker.com/compose/install)
   
**Note**: Make sure you can run `git`, `docker ps`, `docker-compose` without any issue and without sudo command.


## Buidling

`docker-compose build`

## Running

### Start

`docker-compose up -d`

Watch if your worker start is ok

### View logs

`docker-compose logs -f`

### Stop

`docker-compose down`

## Extra options

You can write extra options on the adminui or edit the `docker-compose.yml` and add extra options, such as:
```
   - PRIVATE_KEY=changeme
   - ETH_ADDRESS=0x0000000000000000000000000000000000000000
   - ARCHIPEL_CONTRACT_ADDRESS=0xbecfB5499a9488E445E89C5134aEF60D3A2A7147
   - NODE_URL=http://goerli-geth.dappnode:8545
   - VALIDATOR_NAME=archipel-island
   - VALIDATOR_KEY=changeme
   - HOSTS_TO_PING=8.8.8.8
   - HOSTS_WALLETS=0x0000000000000000000000000000000000000000
```

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details

