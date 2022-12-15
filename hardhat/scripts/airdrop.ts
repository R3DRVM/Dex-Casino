import { ethers, getNamedAccounts, network } from 'hardhat';
import {  Casino__factory } from '../typechain-types';
import { airdropReceivers } from './airdropReceivers';

const main = async () => {
  const { deployer } = await getNamedAccounts();

  const {METAMASK_PK} = process.env

  if (!METAMASK_PK) {
    throw new Error('Please set your METAMASK_PK in a .env file');
  }
 
  console.log('🚀  file: airdrop.ts:13  airdropReceivers', airdropReceivers)
  const airdropAmount = 1000;
  const airdropAmountBn = ethers.utils.parseEther(airdropAmount.toString());
  const networkName = network.name
  console.log('🚀  file: airdrop.ts:11  networkName', networkName)

  const provider = new ethers.providers.AlchemyProvider('goerli', process.env.ALCHEMY_API_KEY);
  const signer = new ethers.Wallet(METAMASK_PK, provider);

  // const signer = ethers.provider.getSigner(deployer)

  const casinoFactory = new Casino__factory(signer);
  const casino = casinoFactory.attach('0x12CE0a13e8f4dFf26bBD03E524DCA7cCce7F73B1');
  // const casinoFactory = await ethers.getContractFactory('Casino');
  // const casino = casinoFactory.attach('0x12CE0a13e8f4dFf26bBD03E524DCA7cCce7F73B1');
  // console.log('🚀  file: airdrop.ts:13  casino', casino)
  const transactionResponse = await casino.doAirdrop(airdropReceivers, airdropAmountBn);
  await transactionResponse.wait(1);
  console.log(`Airdropped ${airdropAmount} to ${airdropReceivers.length} receivers`);
};


// const main = async () => {
//   const { deployer } = await getNamedAccounts();

//   console.log('🚀  file: airdrop.ts:13  airdropReceivers', airdropReceivers)
//   const airdropAmount = 1000;
//   const airdropAmountBn = ethers.utils.parseEther(airdropAmount.toString());
//   // const casino = await ethers.getContract('Casino', deployer);
//   const casinoFactory = await ethers.getContractFactory('Casino');
//   const casino = casinoFactory.attach('0x12CE0a13e8f4dFf26bBD03E524DCA7cCce7F73B1');
//   console.log('🚀  file: airdrop.ts:13  casino', casino)
//   // const transactionResponse = await casino.doAirdrop(airdropReceivers, airdropAmountBn);
//   // await transactionResponse.wait(1);
//   // console.log(`Airdropped ${airdropAmount} to ${airdropReceivers.length} receivers`);
// };

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
