import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { assert, expect } from 'chai';
import { deployments, ethers, getNamedAccounts, network } from 'hardhat';
import { Casino, CasinoToken } from '../../typechain-types';

// const chainId = network.config.chainId as number;
const { chainId } = network.config;
console.log('🚀  file: casino.ts:6  chainId', chainId);

chainId !== 31337
  ? describe.skip
  : describe('Casino unit tests', () => {
      console.log('testing casino...');

      const TOKEN_NAME = 'Awesome Token Yeah';
      const TOKEN_SYMBOL = 'ATY';
      const PURCHASE_RATIO = 10000;
      const BET_FEE = 0.2;

      let casino: Casino,
        casinoContract: Casino,
        player: string,
        deployer: string,
        tokenAddress,
        tokenContract: CasinoToken;

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        player = (await getNamedAccounts()).player;
        await deployments.fixture(['casino']); // Deploys modules with the tag "casino"
        casinoContract = await ethers.getContract('Casino'); // Returns a new connection to the casino contract
        casino = casinoContract.connect(player); // Returns a new instance of the casino contract connected to player
        tokenAddress = await casino.paymentToken();
        tokenContract = await ethers.getContractAt('ERC20', tokenAddress);
      });

      describe('constructor', function() {
        it('has deployed an erc20 paymentToken', async () => {
          const paymentToken = await casino.paymentToken();
          expect(paymentToken).to.exist;
        });

        it('has the correct purchase ratio', async () => {
          const purchaseRatioBn = await casino.purchaseRatio();
          const purchaseRatio = purchaseRatioBn.toNumber();
          // const purchaseRatio = Number(ethers.utils.formatEther(purchaseRatioBn));
          assert.equal(purchaseRatio, PURCHASE_RATIO);
        });
        it('has the correct bet fee', async () => {
          const betFeeBn = await casino.betFee();
          const betFee = Number(ethers.utils.formatEther(betFeeBn));
          assert.equal(betFee, BET_FEE);
        });
        it('creates a token with the supplied name and symbol', async () => {
          const name = await tokenContract.name();
          const symbol = await tokenContract.symbol();
          assert.equal(name, TOKEN_NAME);
          assert.equal(symbol, TOKEN_SYMBOL);
        });
        it('mints 10000 ATY tokens to deployer/owner', async () => {
          const contractBalanceBn = await tokenContract.balanceOf(casinoContract.address);
          const contractBalance = Number(ethers.utils.formatEther(contractBalanceBn));
          assert.equal(contractBalance, 10000);
        });
      });
      describe('doAirdrop', function() {
        it('mints x amount ATY tokens to list of receivers', async () => {
          const amount = 555;
          const amountBn = ethers.utils.parseEther(amount.toString());
          //  before drop
          const playerBalanceBn = await tokenContract.balanceOf(player);
          const playerBalance = Number(ethers.utils.formatEther(playerBalanceBn));

          // after drop
          await casinoContract.doAirdrop([player], amountBn);
          const playerBalanceAfterBn = await tokenContract.balanceOf(player);
          const playerBalanceAfter = Number(ethers.utils.formatEther(playerBalanceAfterBn));
          console.log('🚀  file: casino.test.ts:79  playerBalanceAfter', playerBalanceAfter);
          const diff = playerBalanceAfter - playerBalance;
          assert.equal(diff, amount);
        });
      });
      describe('purchaseTokens', function() {
        it("let's anyone buy tokens with native coin at correct ratio", async () => {
          const balanceBeforeBn = await tokenContract.balanceOf(player);
          const balanceBefore = Number(ethers.utils.formatEther(balanceBeforeBn));
          const amount = 2;
          const amountBn = ethers.utils.parseEther(amount.toString());
          await casinoContract.purchaseTokens({ value: amountBn });
          const balanceAfterBn = await tokenContract.balanceOf(player);
          const balanceAfter = Number(ethers.utils.formatEther(balanceAfterBn));
          assert.equal(balanceAfter - balanceBefore, amount * PURCHASE_RATIO);
        });
      });
      describe('bet', function() {
        let playerBalance: number;
        beforeEach(async () => {
          const balanceBeforeBn = await tokenContract.balanceOf(player);
          const balanceBefore = Number(ethers.utils.formatEther(balanceBeforeBn));
          const buyAmount = 2;
          const amountBn = ethers.utils.parseEther(buyAmount.toString());
          await casinoContract.purchaseTokens({ value: amountBn });
          const playerBalanceBn = await tokenContract.balanceOf(player);
          playerBalance = Number(ethers.utils.formatEther(playerBalanceBn));
          console.log('🚀  file: casino.test.ts:104  playerBalance', playerBalance);
        });
        it('stores a bet as amount * multiplier * (1 - bet fee)', async () => {
          const betAmount = 3;
          const betAmountBn = ethers.utils.parseEther(betAmount.toString());
          const multiplier = 33;
          const betXmultiplier = betAmount * multiplier;
          const betXmultiplierBn = ethers.utils.parseEther(betXmultiplier.toString());
          await tokenContract.approve(casinoContract.address, betXmultiplierBn);

          await casinoContract.bet(betAmount.toString(), multiplier.toString()); // bet is not store in unitBits?
          const playerBetBn = await casinoContract.bets(player);
          const playerBet = ethers.utils.formatEther(playerBetBn);
          assert.equal(Number(playerBet), betAmount * multiplier * (1 - BET_FEE));
        });
        it("reverts if amount is higher than sender's token balance", async () => {
          const highBetamount = playerBalance + 1;
          const highBetamountBn = ethers.utils.parseEther(highBetamount.toString());
          await tokenContract.approve(casinoContract.address, highBetamountBn);
          await expect(casinoContract.bet(highBetamountBn, 2)).to.be.revertedWith(
            'Amount higher than balance'
          );
        });
      });
    });
