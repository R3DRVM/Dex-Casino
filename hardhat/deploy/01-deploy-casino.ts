import { ethers, network } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { verifyContract } from '../utils/verifyContract';

const { ETHERSCAN_API_KEY } = process.env;

const deployCasino =  async ({ deployments, getNamedAccounts }: HardhatRuntimeEnvironment) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId as number;

  const TOKEN_NAME = 'Awesome Token Yeah';
  const TOKEN_SYMBOL = 'ATY';
  const PURCHASE_RATIO = 10000;
  const BET_FEE = 0.2;

  const args = [
    TOKEN_NAME,
    TOKEN_SYMBOL,
    PURCHASE_RATIO,
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


deployCasino.tags = ['all', 'casino'];

export default deployCasino;