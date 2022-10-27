import { ethers } from "ethers";
// import { switchChain } from "./chainConnect";
const SUPPORTED_NETWORKS = {
  80001: "Polygon Mumbai",
};

export const initWrite = async (contractAddress, abi) => {
  if (typeof window.ethereum !== undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return contract;
  } else {
    return null;
  }
};

export const initRead = async (contractAddress, abi) => {
  if (typeof window.ethereum !== undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    return contract;
  } else {
    return null;
  }
};

export const listenForTransactionMine = (txResponse, provider) => {
  console.log(`Mining ${txResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(txResponse.hash, (txReceipt) => {
      resolve(`Completed with ${txReceipt.confirmations} confirmations`);
    });
  });
};

export const getNetwork = async (chainId) => {
  if (!(chainId in SUPPORTED_NETWORKS)) {
    return false;
  }
  return true;
};
