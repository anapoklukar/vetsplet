// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract ownerControl {
    address public VetSplet;

    constructor() {
        VetSplet = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == VetSplet, "Only VetSplet can do this action");
        _;
    }
}

contract DiscountTokens is ERC20, ownerControl {

    struct Account {
        string userID;
    }

    mapping(address => Account) public registered;

    event addingNewUser(address indexed account);

    function registeringAccount(string calldata userID) public {
        require(bytes(registered[msg.sender].userID).length == 0, "Account has already been registered");

        registered[msg.sender].userID = userID;
        emit addingNewUser(msg.sender);
    }

    constructor() ERC20("discountToken", "Discount") {
    }

    function minting(address to, uint256 value) public onlyOwner {
        _mint(to, value);
    }

    function remove(address from, uint256 value) public onlyOwner {
        _burn(from, value);
    }

    function discount(address from, uint256 value) public returns (bool) {
        require(balanceOf(from) >= value, "Not enough tokens");
        _burn(from, value);
        return true;
    }

    function getAccount(address account) public view returns (Account memory) {
        return registered[account];
    }
}