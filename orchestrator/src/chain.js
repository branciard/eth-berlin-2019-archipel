

const { Contract, providers, Wallet } = require('ethers');

const ARCHIPEL_ABI =[
    "event LeaderChanged(address indexed previousLeader, address indexed newLeader)",
    "constructor()",
    "function leader() view returns (address)",
    "function setLeader(address _reportLeader)"
];

// Get leader from blockchain
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

// Set leader to blockchain

const setLeader = async (privateKey,archipelContractAddress,nodeUrl,reportLeader) => {
    try {

        let provider = new providers.JsonRpcProvider(nodeUrl);
        let wallet = new Wallet(privateKey, provider);
        let contractWithSigner = new Contract(archipelContractAddress, ARCHIPEL_ABI, wallet)

        console.log("Try call SetLeader with reported leader : "+reportLeader);
        let tx;
        try {
            tx = await contractWithSigner.setLeader(reportLeader);
            console.log("Transaction sent : "+tx.hash);
            // The operation is NOT complete yet; we must wait until it is mined
            await tx.wait();
            console.log("Transaction mined : "+tx.hash);
        }
        catch (e){
            console.log("Transaction FAILED ");
            console.log(e);
            return false;
        }
        const receipt = await provider.getTransactionReceipt(tx.hash);
        if(receipt.status == 1 ){
            console.log("Leadership changed. You are the new leader.");
            return true 
        }
        else{
           return false;
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
};

module.exports = {
    getLeader,
    setLeader,
};