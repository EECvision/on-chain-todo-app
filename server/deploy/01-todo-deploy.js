const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat.config")
const { verify } = require("../utils/verify")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts()
  const { log, deploy } = deployments

  log(network)

  const todo = await deploy("Todo", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  // Verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    (process.env.ETHERSCAN_API_KEY || process.env.POLYGONSCAN_API_KEY)
  ) {
    await verify(todo.address, [])
  }
}

module.exports.tags = ["all", "todo"]
