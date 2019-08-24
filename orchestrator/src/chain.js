

const { Contract, providers, Wallet } = require('ethers');

const ARCHIPEL_ABI =[
    "event LeadershipChanged(address indexed previousLeader, address indexed newLeader)",
    "constructor()",
    "function leader() view returns (address)",
    "function setLeader()"
];

const getLeader = async (archipelContractAddress,nodeUrl) => {
    try {

        let provider = new providers.JsonRpcProvider(nodeUrl);
        let contract = new Contract(archipelContractAddress, ARCHIPEL_ABI, provider);
        const leader = await contract.leader();
        return leader;
      } catch (error) {
        console.log(error);
        throw error;
      }
};

const setLeader = async (privateKey,archipelContractAddress,nodeUrl) => {
    try {

        let provider = new providers.JsonRpcProvider(nodeUrl);
        let wallet = new Wallet(privateKey, provider);
        let contractWithSigner = new Contract(archipelContractAddress, ARCHIPEL_ABI, wallet)

        let tx = await contractWithSigner.setLeader();

        console.log("Transaction sent : "+tx.hash);

        // The operation is NOT complete yet; we must wait until it is mined
        await tx.wait();
        console.log("Transaction mined : "+tx.hash);

        const newLeader = await contractWithSigner.leader();
        return newLeader;
      } catch (error) {
        console.log(error);
        throw error;
      }
};

module.exports = {
    getLeader,
    setLeader,
};