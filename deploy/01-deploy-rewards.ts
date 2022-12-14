import { network } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

export default async ({ deployments, getNamedAccounts }: HardhatRuntimeEnvironment) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId as number;
  console.log('Hi from deploy reord');

//   const args = [];
  const contractFundMe = await deploy('FundMe', {
    from: deployer,
    // args: args,
    log: true, // custom logging, replaces console.logs
    // waitConfirmations: networkConfig[chainId]?.blockConfirmations || 0
  });
};

// export default deployRewards;
