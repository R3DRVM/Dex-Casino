import { ethers, network } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { verifyContract } from '../utils/verifyContract';

const { ETHERSCAN_API_KEY } = process.env;

export default async ({ deployments, getNamedAccounts }: HardhatRuntimeEnvironment) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId as number;

  const TOKEN_NAME = 'New token Yeah';
  const TOKEN_SYMBOL = 'NTY';
  const PURCHASE_RATIO = 10000;
  const BET_PRICE = 1;
  const BET_FEE = 0.2;

  const args = [
    TOKEN_NAME,
    TOKEN_SYMBOL,
    PURCHASE_RATIO,
    ethers.utils.parseEther(BET_PRICE.toFixed(18)),
    ethers.utils.parseEther(BET_FEE.toFixed(18)),
  ];
  const contractCasino = await deploy('Casino', {
    from: deployer,
    args: args,
    log: true, // custom logging, replaces console.logs
    waitConfirmations: chainId === 31337 ? 0 : 3, // wait for 1 confirmation in non-local networks
  });

  if (chainId !== 31337 && ETHERSCAN_API_KEY) {
    await verifyContract(contractCasino.address, args);
  }
};
