GamerToken
A smart contract ERC20 token for an in-game currency system. Players can earn, transfer, burn, and redeem tokens for in-game items.

Description
The `GameToken` is an ERC20-based token that allows players to mint, transfer, burn, and redeem tokens for in-game rewards. It also allows the owner of the contract to mint tokens for players. Players can redeem their tokens for items from an in-game store, which consists of different items that require varying amounts of tokens. The contract also keeps track of the items each player has redeemed.

Getting Started
Installing
1) npm install @openzeppelin/contracts
2) ensure you have a metamask wallet and have testnet tokens to cover the token fees.
3) use deploy.js to deploy the GameToken.sol file
Executing program
1) compile the contract:- npx hardhat compile
2) deploy the contract (avalanche fuji testnet)
3) interact with tokens, mint,burn ,redeem and burn.
4) This is the code:-
5) // SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract GameToken is ERC20, Ownable, ERC20Burnable {

    event ItemRedeemed(address indexed player, string itemName);

    // Struct to store details of in-game items
    struct GameItem {
        string name;
        uint256 cost; 
    }

    // Mapping to track redeemed items for each player
    mapping(address => string[]) private redeemedItems;

    // Array of available game items
    GameItem[] private gameItems;

    constructor() ERC20("GameToken", "GTN") Ownable(msg.sender) {
        // Initialize items with different values
        gameItems.push(GameItem("Sword of Power", 300));
        gameItems.push(GameItem("Shield of Valor", 200)); 
        gameItems.push(GameItem("Helmet of Wisdom", 150)); 
        gameItems.push(GameItem("Potion of Healing", 75)); 
    }

    // Function to mint new tokens, restricted to the contract owner
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Function to transfer tokens to other players
    function transferTokens(address _to, uint256 amount) external {
    require(balanceOf(msg.sender) >= amount, "Insufficient balance");
    _transfer(msg.sender, _to, amount);
}


    // Function to check the balance of the player
    function getBalance() external view returns (uint256) {
        return balanceOf(msg.sender);
    }

    // Function to burn tokens from a player's balance
    function burnTokens(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _burn(msg.sender, amount);
    }

    // Function to display available game items and their costs
    function getGameStore() public pure returns (string memory) {
        return "1. Sword of Power (300 tokens)\n2. Shield of Valor (200 tokens)\n3. Helmet of Wisdom (150 tokens)\n4. Potion of Healing (75 tokens)";
    }

    // Function to redeem tokens for an in-game item
    function redeemItem(uint256 amount) external {
        require(amount >= 75, "Minimum of 75 tokens required");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        // Burn tokens
        _burn(msg.sender, amount);

        // Find the item based on the amount burned
        for (uint i = 0; i < gameItems.length; i++) {
            if (amount >= gameItems[i].cost) {
                // Record the redeemed item
                redeemedItems[msg.sender].push(gameItems[i].name);
                emit ItemRedeemed(msg.sender, gameItems[i].name);
                return;
            }
        }

        revert("No suitable item available for the amount burned");
    }

    // Function to get the list of redeemed items for a player
    function getRedeemedItems() external view returns (string[] memory) {
        return redeemedItems[msg.sender];
    }
}
Help

Authors
Devyanshika Pandey


License
This project is licensed under the MIT License - see the LICENSE.md file for details
