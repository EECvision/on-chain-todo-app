const { network } = require("hardhat")
const hre = require("hardhat")
const { developmentChains } = require("../helper-hardhat.config")
const updateFrontend = require("../utils/update-frontend")
const { verify } = require("../utils/verify")
require("dotenv").config()

async function main() {
  Todo = await hre.ethers.getContractFactory("Todo")

  todo = await Todo.deploy()

  await todo.deployed()

  await updateFrontend(todo, "Todo")

  console.log(`Todo deployed to address ${todo.address}`)

  // Verify the deployment
  // if (
  //   !developmentChains.includes(network.name) &&
  //   (process.env.ETHERSCAN_API_KEY || process.env.POLYGONSCAN_API_KEY)
  // ) {
  await verify(todo.address, [])
  // }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
