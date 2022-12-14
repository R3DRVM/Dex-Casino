import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'dotenv/config';
import 'hardhat-deploy';
// import '@nomiclabs/hardhat-ethers'

const { ALCHEMY_API_KEY, ETHERSCAN_API_KEY, GAS_REPORTER_ENABLED, CMC_API_KEY } = process.env;

const networkArg = process.argv[3];
const METAMASK_PK = process.env.METAMASK_PK as string;

// This should include any network we intend to use besides localhost/hardhat
if (networkArg === 'goerli' && !METAMASK_PK) {
  throw new Error('METAMASK_PK missing');
}

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [METAMASK_PK],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, // this will by default take the first account as deployer.
    },
  },

  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: GAS_REPORTER_ENABLED === 'true' ? true : false, // running gas reporter slows down tests significantly
    outputFile: 'gas-report.txt',
    noColors: true,
    currency: 'USD',
    // gasPrice: 21,
    coinmarketcap: CMC_API_KEY, // needed for currency to work
    token: 'ETH',
  },
};

export default config;
