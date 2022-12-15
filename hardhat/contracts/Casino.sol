// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {CasinoToken} from "./Token.sol";

/// @title A very simple lottery contract
/// @author Matheus Pagani
/// @notice You can use this contract for running a very simple lottery
/// @dev This contract implements a relatively weak randomness source
/// @custom:teaching This is a contract meant for teaching only

contract Casino is Ownable {
    /// @notice A struct representing a bet

    /// @notice Address of the token used as payment for the bets
    CasinoToken public paymentToken;
    /// @notice Amount of tokens given per ETH paid
    uint256 public purchaseRatio;
    /// @notice Amount of tokens required for placing a bet that goes for the owner pool
    uint256 public betFee;
    /// @notice Amount of tokens in the owner pool
    uint256 public ownerPool;

    /// @notice Mapping of winings available for withdraw for each account
    mapping(address => uint256) public winnings;
    /// @notice Mapping of bets to addresses
    mapping(address => uint256) public bets;

    /// @notice Constructor function
    /// @param tokenName Name of the token used for payment
    /// @param tokenSymbol Symbol of the token used for payment
    /// @param _purchaseRatio Amount of tokens given per ETH paid
    /// @param _betFee Amount of tokens required for placing a bet that goes for the owner pool
    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        uint256 _purchaseRatio,
        uint256 _betFee
    ) {
        paymentToken = new CasinoToken(tokenName, tokenSymbol);
        purchaseRatio = _purchaseRatio;
        betFee = _betFee;
    }

    receive() external payable {}

    /// @notice Give tokens based on the amount of ETH sent
    function purchaseTokens() public payable {
        paymentToken.mint(msg.sender, msg.value * purchaseRatio);
    }

    /// @notice Charge the amount and add bet amount multiplied by multiplier to bets mapping
    function bet(uint256 amount, uint256 multiplier) public payable {
        require(
            amount <= paymentToken.balanceOf(msg.sender),
            "Amount higher than balance"
        ); // This might be redundant. Seems to revert without it.
        bets[msg.sender] = (amount * multiplier) * (1e18 - betFee);
        ownerPool += amount * multiplier * betFee;
        paymentToken.transferFrom(msg.sender, address(this), amount);
    }

    /// @notice Withdraw all tokens to senders from their winnings
    function payout() public {
        uint256 _winnings = winnings[msg.sender];
        winnings[msg.sender] = 0;
        paymentToken.transfer(msg.sender, _winnings);
    }

    /// @notice Withdraw `amount` from the owner pool
    function ownerWithdraw(uint256 amount) public onlyOwner {
        require(amount <= ownerPool, "Not enough fees collected");
        ownerPool -= amount;
        paymentToken.transfer(msg.sender, amount);
    }

    /// @notice Burn `amount` tokens and give the equivalent ETH back to user
    function returnTokens(uint256 amount) public {
        paymentToken.burnFrom(msg.sender, amount);
        payable(msg.sender).transfer(amount / purchaseRatio);
    }

    /// @notice
    function win(address player) public onlyOwner {
        bets[player] = 0;
        winnings[player] += bets[player];
    }

    /// @notice
    function lose(address player) public onlyOwner {
        bets[player] = 0;
    }

    /// @notice
    function doAirdrop(address[] memory to, uint256 amount) public onlyOwner {
        paymentToken.airdrop(to, amount);
    }
}
