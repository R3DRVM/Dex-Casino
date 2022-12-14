import 'dotenv/config';
import fs from 'fs';
import { ethers, network } from 'hardhat';

const frontEndContractsFile = '../dApp/client/src/constants/casino/casinoAddresses.json';
const frontEndAbiFile = '../dApp/client/src/constants/casino/casinoAbi.json';
const chainId = network.config.chainId as number;

const updateFrontend = async () => {
  if (!chainId) {
    console.log('Can\t update frontend, no chainId');
    return;
  }
  if (process.env.UPDATE_FRONTEND) console.log('..Updating frontend files with new deployments...');
  await updateContractAddresses();
  await updateAbi();
  console.log('Frontend files updated')
};

const updateContractAddresses = async () => {
  const casino = await ethers.getContract('Casino');
  const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, 'utf8'));
  if (chainId.toString() in contractAddresses) {
    if (!contractAddresses[chainId.toString()].includes(casino.address)) {
      contractAddresses[chainId.toString()].push(casino.address);
    }
  } else {
    contractAddresses[chainId.toString()] = [casino.address];
  }
  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses));
};

const updateAbi = async () => {
  const casino = await ethers.getContract('Casino');
  fs.writeFileSync(
    frontEndAbiFile,
    casino.interface.format(ethers.utils.FormatTypes.json) as string
  );
};

updateFrontend.tags = ['all', 'frontend'];

export default updateFrontend;
