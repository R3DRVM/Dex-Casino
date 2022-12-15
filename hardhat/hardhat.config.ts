import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'dotenv/config';
import 'hardhat-deploy';
// import '@nomiclabs/hardhat-ethers'

const { ALCHEMY_API_KEY, ETHERSCAN_API_KEY, GAS_REPORTER_ENABLED, CMC_API_KEY } = process.env;
const METAMASK_PK = process.env.METAMASK_PK as string;

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  // defaultNetwork: 'localhost',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545/',
      chainId: 31337,
    },
    goerli: {
      chainId: 5,
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [METAMASK_PK],
    },
    polygon: {
      chainId: 137,
      url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [METAMASK_PK],
    },
    mumbai: {
      chainId: 80001,
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [METAMASK_PK],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, // this will by default take the first account as deployer.
    },
    player: {
      default: 0,
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
