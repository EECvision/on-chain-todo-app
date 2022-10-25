require("dotenv").config()
const fs = require("fs")
const { network, ethers } = require("hardhat")

const frontEndContractsFile = "../constants/networkMapping.json"
const frontEndAbiLocation = "../constants/"

module.exports = async () => {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Writing to front end...")
    const contract = await ethers.getContract("Todo")
    await updateContractAddresses(contract)
    await updateAbi(contract)
    console.log("Front end written!")
  }
}

async function updateAbi(contract) {
  fs.writeFileSync(
    `${frontEndAbiLocation}abi.json`,
    contract.interface.format(ethers.utils.FormatTypes.json)
  )
}

async function updateContractAddresses(contract) {
  const chainId = network.config.chainId.toString()
  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractsFile, "utf8")
  )
  if (chainId in contractAddresses) {
    if (!contractAddresses[chainId].includes(contract.address)) {
      contractAddresses[chainId].push(contract.address)
    }
  } else {
    contractAddresses[chainId] = [contract.address]
  }
  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}
