import { AddressLike } from "ethers"
import { BridgeOptions, Chains } from "../type/types"
import erc20_abi from "./abis/erc20"







// ABIS
export const ERC20_ABI = erc20_abi





// ADDRESSES
export const NATIVE_TOKEN = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"

/**
 * @notice SocketGateway is the new version of Registry contract. This contract stores all route IDs with corresponding Implementation 
 *         contract addresses, representing which bridge and DEX respectively will be used for a given route.
 */
export const SOCKET_GATEWAY: { [key in Chains]: AddressLike } = {
  arbitrum: "0x3a23F943181408EAC424116Af7b7790c94Cb97a5", 
  aurora: "0x3a23F943181408EAC424116Af7b7790c94Cb97a5",
  avalanche: "0x3a23F943181408EAC424116Af7b7790c94Cb97a5",
  bsc: "0x3a23F943181408EAC424116Af7b7790c94Cb97a5",
  ethereum: "0x3a23F943181408EAC424116Af7b7790c94Cb97a5",
  fantom: "0x3a23F943181408EAC424116Af7b7790c94Cb97a5",
  gnosis: "0x3a23F943181408EAC424116Af7b7790c94Cb97a5",
  optimism: "0x3a23F943181408EAC424116Af7b7790c94Cb97a5",
  polygon: "0x3a23F943181408EAC424116Af7b7790c94Cb97a5",
  zksync: "0xaDdE7028e7ec226777e5dea5D53F6457C21ec7D6",
  zkevm: "0x3a23F943181408EAC424116Af7b7790c94Cb97a5",
  base: "0x3a23f943181408eac424116af7b7790c94cb97a5",
}

export const REGISTRY: { [key in Chains]: AddressLike } = {
  arbitrum: "0xc30141B657f4216252dc59Af2e7CdB9D8792e1B0", 
  aurora: "0xc30141B657f4216252dc59Af2e7CdB9D8792e1B0",
  avalanche: "0x2b42AFFD4b7C14d9B7C2579229495c052672Ccd3",
  bsc: "0xc30141B657f4216252dc59Af2e7CdB9D8792e1B0",
  ethereum: "0xc30141B657f4216252dc59Af2e7CdB9D8792e1B0",
  fantom: "0xc30141B657f4216252dc59Af2e7CdB9D8792e1B0",
  gnosis: "0xc30141B657f4216252dc59Af2e7CdB9D8792e1B0",
  optimism: "0xc30141B657f4216252dc59Af2e7CdB9D8792e1B0",
  polygon: "0xc30141B657f4216252dc59Af2e7CdB9D8792e1B0",
  zksync: "",
  zkevm: "",
  base: "",
}




// Tokens
export const TOKENS: { [key in Chains]: any } = {

  ethereum: {
    eth: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    weth9: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },

  polygon: {
    matic: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    weth9: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    weth: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    usdc:'0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    dai:'0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    usdt:'0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  },

  arbitrum: {
    eth: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    weth9: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    usdc:'0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    dai:'0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    usdt:'0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  },
  
  optimism: {
    eth: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    weth9: "0x4200000000000000000000000000000000000006",
    dai: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    usdc: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    usdt: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  },

  bsc: {
    bnb: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    weth9: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    weth: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
    dai: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
    usdc: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    usdt: '0x55d398326f99059fF775485246999027B3197955',
  },

  
  aurora: {},
  avalanche: {},
  fantom: {},
  gnosis: {},
  zksync: {},
  zkevm: {},
  base: {},

}

// Misc
export const SOCKET_V2_URL = "https://api.socket.tech/v2"
export const DEFAULT_BRIDGE_OPTION: BridgeOptions = {
  max: false,
  slipage: 0.5, // 0.5% of slipage tolerance
  uniqueRoutesPerBridge: true,
  sort: 'output'
}



// Chains

export const CHAIN_ID: { [ key in Chains ]: number } = {

  ethereum: 1,
  arbitrum: 42161,
  polygon: 137,
  optimism: 10,
  bsc: 56,
  zksync: 324,
  avalanche: 43114,

  aurora: 0,
  fantom: 0,
  gnosis: 0,
  zkevm: 0,
  base: 0,
}

export const CHAIN_ID_TO_NAME: { [ key: number ]: Chains } = {

  1: "ethereum", 
  42161: "arbitrum",
  137: "polygon", 
  10: "optimism",
  56: "bsc",

  20: "aurora",
  30: "avalanche",
  40: "fantom",
  50: "gnosis",
  60: "zksync",
  70: "zkevm",
  80: "base",
}