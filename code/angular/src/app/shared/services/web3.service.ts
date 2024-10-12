import { Injectable } from '@angular/core';
import { Web3 } from "web3";
import { Contract } from "web3-eth-contract";
import { environment } from "../../../environments/environment";
declare let window: any;

enum Users {
  guest = 1,
  client = 2,
  VetSplet = 3,
}

@Injectable({
  providedIn: 'root'
})

export class Web3Service {
  public userAddress!: string;
  public users: Users = Users.guest;
  private web3!: any;
  private contract!: Contract<any>;
  constructor() {}
  public async connectToBC(): Promise<string> {
    let message = "";
    try {
      // Check if MetaMask is installed
      if (!window.ethereum?.isMetaMask)
        throw new Error("Please install MetaMask wallet!");
      // Check if MetaMask is connected and get the user address
      this.userAddress = (
        await window.ethereum.request({
          method: "eth_requestAccounts",
        })
      )[0];
      // Check the chain ID
      if (
        Web3.utils.toDecimal(
          await window.ethereum.request({ method: "eth_chainId" })
        ) !== environment.allowedChainId
      )
        throw new Error("Chain not allowed, please reconnect MetaMask wallet!");
      // Connect to the blockchain
      this.web3 = new Web3(window.ethereum);
      // Get the contract
      this.contract = new this.web3.eth.Contract(
        (await (await fetch(environment.contractUrl)).json()).abi,
        environment.contractAddress
      );
        this.users = Users.guest;
      if (
        await (this.contract.methods["getAccount"] as any)(
          this.userAddress
        ).call()
      )
      this.users = Users.client
    } catch (error: any) {
      // console.log(error);
      message = error.message;
    }
    return message;
  }

  public async registerUser() {
    try {
      console.log(localStorage.getItem("id"))
      let result = await (this.contract.methods["registeringAccount"] as any)(
        localStorage.getItem("id")
      ).send({ from: this.userAddress })
      return result;
    } catch (error: any) {
      return error;
    }
  }

  public async addingTokens(amount: number){
    try{
      let result = await (this.contract.methods["minting"] as any)(
        "0xf57FE3f91F261803a24e7092d2806f308DfE1cCe", this.web3.utils.toNumber(amount)
      ).send({ from: this.userAddress })
      return result;
    } catch (error: any) {
      return error;
    }
  }

  public async givingTokens(amount: number, address: string){
    try{
      let result = await (this.contract.methods["give"] as any)(
        this.userAddress, this.web3.utils.toNumber(amount)
      ).send({ from: address })
      return result;
    } catch (error: any) {
      return error;
    }
  }

  public async removingTokens(amount: number){
    try{
      let result = await (this.contract.methods["remove"] as any)(
        this.userAddress, this.web3.utils.toNumber(amount)
      ).send({ from: this.userAddress })
      return result;
    } catch (error: any) {
      return error;
    }
  }

  public async getAccount(){
    try{
        let result = await (this.contract.methods["getAccount"] as any)(
        this.userAddress
        ).call()
      return result;
    }catch (error: any){
      return error;
    }
  }

  public async balanceOf(){
    try{
      let result = await (this.contract.methods["balanceOf"] as any)(
        this.userAddress
      ).call()
      return result;
    }catch (error: any){
      return error;
    }
  }

  public async discountTokens(amount: number){
    try{
      let result = await (this.contract.methods["discount"] as any)(
        this.userAddress, this.web3.utils.toNumber(amount)
      ).send({ from: this.userAddress })
      return result;
    }catch (error: any){
      return error;
    }
  }
  public listenForTokenAddition(): void {
    (this.contract.events['TokenAdded'] as any)({
      filter: {user: this.userAddress},
      fromBlock: 'latest'
    })
    .on('data', event => {
      console.log('Token Added Event:', event);
    })
    .on('error', error => {
      console.error('Error in TokenAdded event:', error);
    });
  }

}
