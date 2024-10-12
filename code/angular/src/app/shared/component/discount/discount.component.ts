import { Component, OnInit} from '@angular/core';
import { Web3Service } from "../../services/web3.service";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-discount',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './discount.component.html',
  styleUrl: './discount.component.css'
})

export class DiscountComponent implements OnInit {
  protected message: string = "Please connect MetaMask wallet to continue!";
  constructor(public web3Service: Web3Service) {}
  ngOnInit(): void {
    this.web3Service
      .connectToBC()
      .then((message: string) => (this.message = message));
  }

  async registerUser(){
    let x = await this.web3Service.registerUser()
    console.log(x)
    console.log(await this.web3Service.getAccount())
  }

  async addingTokens(){
    let x = await this.web3Service.addingTokens(5)
    console.log(x)
  }

  async removingTokens(){
    let x = await this.web3Service.removingTokens(5)
    console.log(x)
  }

  async discountTokens(){
    let x = await this.web3Service.discountTokens(2)
    console.log(x)
  }

  async balanceOf(){
    let x = await this.web3Service.balanceOf()
    console.log(x)
  }

}
