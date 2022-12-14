import {run} from 'hardhat';

export const verifyContract = async (contractAddress: string, args: any) => {
  console.log('Verifying contract...');
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args
    });
  } catch (error: any) {
    if (error.message.includes('already verified')) {
      console.log('Contract already verified.');
    } else {
      console.log('Error verifying contract: ', error.message);
    }
  }
};
