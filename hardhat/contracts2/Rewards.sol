// pragma solidity ^0.8.0;

// contract Rewards {
//   uint public rewardAmount;

//   constructor() public {
//     rewardAmount = 0;
//   }

//   function bet(uint amount) public {
//     // Check that the player has enough funds to make the bet
//     require(msg.sender.balance >= amount, "Insufficient funds, use our swap to get more tokens!");

//     // Deduct the bet amount from the player's balance
//     msg.sender.transfer(amount);

//     // Store the bet amount in a mapping to keep track of it
//     bets[msg.sender] = amount;
//   }

//   function win() public {
//     // Retrieve the amount of the player's bet
//     uint betAmount = bets[msg.sender];

//     // Calculate the reward amount and add it to the contract's reward pool
//     rewardAmount += betAmount * 2;

//     // Transfer the winnings to the player
//     msg.sender.transfer(betAmount * 2);

//     // Clear the player's bet amount from the mapping
//     delete bets[msg.sender];
//   }

//   function lose() public {
//     // Amount of the player's bet
//     uint betAmount = bets[msg.sender];

//     // Clear the bet amount
//     delete bets[msg.sender];
//   }

//   // function to view reward balance
//   function viewReward() public view returns (uint) {
//     return rewardAmount;
//   }

//   // tracking each player's bet
//   mapping(address => uint) bets;
// }
