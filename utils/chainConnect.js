export const chainIdToParams = {
  137: {
    chainId: "0x89",
    chainName: "Polygon Matic",
    nativeCurrency: { name: "Matic", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://www.polygonscan.com/"],
    iconUrls: [""],
  },

  80001: {
    chainId: "0x13881",
    chainName: "Polygon Testnet",
    nativeCurrency: { name: "Matic", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-mumbai.g.alchemy.com/v2/sjbvWTjbyKXxvfJ1HkHIdEDHc2u8wNym"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    iconUrls: [""],
  },

  42220: {
    chainId: "0xa4ec",
    chainName: "Celo",
    nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
    rpcUrls: ["https://forno.celo.org"],
    blockExplorerUrls: ["https://explorer.celo.org/"],
    iconUrls: ["future"],
  },

  44787: {
    chainId: "0xaef3",
    chainName: "Alfajores Testnet",
    nativeCurrency: { name: "Alfajores Celo", symbol: "A-CELO", decimals: 18 },
    rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
    blockExplorerUrls: ["https://alfajores-blockscout.celo-testnet.org/"],
    iconUrls: ["future"],
  },

  62320: {
    chainId: "0xf370",
    chainName: "Baklava Testnet",
    nativeCurrency: { name: "Baklava Celo", symbol: "B-CELO", decimals: 18 },
    rpcUrls: ["https://baklava-forno.celo-testnet.org"],
    blockExplorerUrls: ["https://baklava-blockscout.celo-testnet.org/"],
    iconUrls: ["future"],
  },

  1313161554: {
    chainId: "0x4e454152",
    chainName: "Aurora",
    nativeCurrency: { name: "Aurora", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.aurora.dev/"],
    blockExplorerUrls: ["https://aurorascan.dev/"],
    iconUrls: [""],
  },

  1313161555: {
    chainId: "0X4E454153",
    chainName: "Aurora Testnet",
    nativeCurrency: { name: "Aurora", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://testnet.aurora.dev/"],
    blockExplorerUrls: ["https://testnet.aurorascan.dev/"],
    iconUrls: [""],
  },
};

const chainDecimalsToHex = {
  137: "0x89",
  80001: "0x13881",
  42220: "0xa4ec",
  44787: "0xaef3",
  62320: "0xf370",
  1313161554: "0x4e454152",
  1313161555: "0X4E454153",
};

export async function switchChain(chainId) {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: chainDecimalsToHex[chainId],
        },
      ],
    });

    return null;
  } catch (error) {
    console.log("switch error: ", error);
    return error;
  }
}

export async function addChain(chainId) {
  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [chainIdToParams[chainId]],
    });
    return null;
  } catch (error) {
    console.log("add error: ", error);
    return error;
  }
}
