require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")

require("dotenv").config()

const PRIVATE_KEY = process.env.PRIVATE_KEY

const POLYGON_ALCHEMY_RPC_URL = process.env.POLYGON_ALCHEMY_RPC_URL
const GOERLI_ALCHEMY_RPC_URL = process.env.GOERLI_ALCHEMY_RPC_URL

const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [{ version: "0.8.17" }],
  },
  networks: {
    goerli: {
      url: GOERLI_ALCHEMY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 6,
    },
    mumbai: {
      url: POLYGON_ALCHEMY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 80001,
      blockConfirmations: 6,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: POLYGONSCAN_API_KEY,
      goerli: ETHERSCAN_API_KEY,
    },
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-reporter.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "MATIC",
  },
}
