import React, { Component } from "react";
import ArchipelContract from "./contracts/Archipel.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      //const deployedNetwork = ArchipelContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ArchipelContract.abi,
        //deployedNetwork && deployedNetwork.address,
        '0xcE66d5344E364FF2C8915B787f9850EDaE69331C'
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


   sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  runExample = async () => {
    const { accounts, contract } = this.state;


     while(true){
      // Get the value from the contract to prove it worked.
      const response = await contract.methods.leader().call();
      console.log('coucou');
      // Update state with the result.
      this.setState({ storageValue: response });
      await this.sleep(5000);
     }



  
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="App">


    <div id="pricing-table" class="clear">
    <div class="plan">
        <h3>DAPPNODE<span>AVADO</span></h3>
        <a class="signup" href="">{this.state.storageValue == '0xb347cfd9Fa53022BBbA2210d81687055478eaA25'?"VALIDATE":"BACKUP"}</a>         
        <ul>
        <li><b>Address</b> 0xb347cfd9Fa53022BBbA2210d81687055478eaA25</li>	
        </ul> 
    </div>


    <div class="plan"  id="most-popular" >
        <h3>DAPPNODE<span>NUC</span></h3>
        <a class="signup" href="">{this.state.storageValue == '0x18625a9fc00653b7163F83aAb7c88C590fbCaeA8'?"VALIDATE":"BACKUP"}</a>        
        <ul>
        <li><b>Address</b> 0x18625a9fc00653b7163F83aAb7c88C590fbCaeA8</li>			
        </ul>    
    </div>
    <div class="plan">
        <h3>DAPPNODE<span>RADIATOR</span></h3>
		<a class="signup" href="">{this.state.storageValue == '0x468e210179C85b7f3b548050B0566A79Ba1dAAc5'?"VALIDATE":"BACKUP"}</a>
        <ul>
            <li><b>Address</b> 0x468e210179C85b7f3b548050B0566A79Ba1dAAc5</li>		
        </ul>
    </div>
</div>



      </div>
    );
  }
}

export default App;
