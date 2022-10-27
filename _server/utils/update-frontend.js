require("dotenv").config()
const fs = require("fs")
const { network } = require("hardhat")

const frontEndContractsFile = "../constants/networkMapping.json"
const frontEndAbiLocation = "../constants/"

module.exports = async (contract, location) => {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Writing to front end...")
    await updateContractAddresses(contract, location)
    await updateAbi(contract, location)
    console.log("Front end written!")
  }
}

async function updateAbi(contract, location) {
  fs.writeFileSync(
    `${frontEndAbiLocation}${location}.json`,
    contract.interface.format(ethers.utils.FormatTypes.json)
  )
}

async function updateContractAddresses(contract, location) {
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
