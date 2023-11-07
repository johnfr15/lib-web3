import { BridgeOptions, Chains } from "../types"
import erc20_abi from "./abis/erc20"
import sushiXSwap_v2 from "./abis/sushiXSwap_v2"
import stargate_adapter from "./abis/stargate_adapter"





/***********************************|
|            PROVIDERS              |
|__________________________________*/
export const POLYGON_PROVIDER: {[key: string]: string} = {
  "MAINNET": "https://polygon-mainnet.infura.io/v3/78581dc93b6d43088baba2bb1606d0c8",
  "TESTNET": "https://polygon-mumbai.infura.io/v3/78581dc93b6d43088baba2bb1606d0c8",
}





/***********************************|
|              ABIS                 |
|__________________________________*/
export const ERC20_ABI = erc20_abi
export const SUSHI_X_SWAP_V2_ABI = sushiXSwap_v2
export const STARGATE_ADAPTER_ABI = stargate_adapter





/***********************************|
|            CONTRACTS              |
|__________________________________*/
export const SUSHI_X_SWAP_V2: { [key in Chains]: any } = {
  polygon: "0xc45a496bcc9ba69ffb45303f7515739c3f6ff921",
  arbitrum: "0xec4a1bf5738841456054bd720bedf18be2e3f8f0",
  optimism: "0xd9d93d4daa6656b13dbc1997a0c543ac86ff2690",
  ethereum: "0xd294d0d26ef0ff2087a35616b7aada083c53640f",
  avalanche: "0xfec47ce995b4f3c0e42ef4d477150313a4d22211",
  bsc: "0xdd9c6c40171ea2dfc31ed00b0a58be2c8a3c7971",
} 

export const STARGATE_ADAPTER: { [key in Chains]: any } = {
  polygon: "0x6df3838fcefd6642ad1435a4d93ed8bf6fd772f5",
  arbitrum: "0x3541e8529d17396048a5068efc361b9fdad21eea",
  optimism: "0x4f52281a6a10db9761ceb39435f96d286f684d86",
  ethereum: "0x8a9f096992d4adf48c4e302b3593832785ddde01",
  avalanche: "0xac8d8775dfb6de938d50aeb76972f77a1682dc85",
  bsc: "0xa7d7fbe0b2122f7055bebfe8e5f793034339ad1f",
}

export const WETH: { [key in Chains]: any } = {
  polygon: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  arbitrum: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1 ",
  optimism: "",
  ethereum: "",
  avalanche: "",
  bsc: "",
}





/***********************************|
|              TOKENS               |
|__________________________________*/
export const TOKENS: { [key in Chains]: any } = {

  polygon: {
    matic: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    wmatic: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    weth: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    usdc:'0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    dai:'0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    usdt:'0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  },

  arbitrum: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    usdc:'0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    dai:'0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    usdt:'0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  },
  
  optimism: {},

  ethereum: {},

  avalanche: {},

  bsc: {},

}





/***********************************|
|              MISC                 |
|__________________________________*/
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export const DEFAULT_BRIDGE_OPTION: BridgeOptions = {
  max: false,
  network: "MAINNET",
  slipage: 2          // 2% of slipage tolerance
}

export const MINIMUM_GAS: bigint = BigInt( 100000 )

export enum Stargate_func {
  NULL,
  SWAP_REMOTE,
  ADD_LIQUIDITY,          
  REDEEM_LOCAL_CALL_BACK,
  WITHDRAW_REMOTE,
}

export const STARGATE_POOL_IDS: { [key in Chains]: any } = {

  arbitrum: {
    USDC: 1,
    USDT: 2,
    FRAX: 7,
    ETH: 13,
    LUSD: 15,
    MAI: 16,
  },

  polygon: {
    USDC: 1,
    USDT: 2,
    DAI: 3,
    MAI: 16,
  },

  optimism: {
    USDC: 1,
    DAI: 3,
    FRAX: 7,
    ETH: 13,
    sUSD: 14,
    LUSD: 15,
    MAI: 16,
  },

  ethereum: {
    USDC: 1,
    USDT: 2,
    DAI: 3,
    FRAX: 7,
    USDD: 11,
    ETH: 13,
    sUSD: 14,
    LUSD: 15,
    MAI: 16,
    METIS: 17,
    metisUSDT: 19,
  },

  avalanche: {
    USDC: 1,
    USDT: 2,
    FRAX: 7,
    MAI: 16,
    metisUSDT: 19,  
  },

  bsc: {
    USDT: 2,
    BUSD: 5,
    USDD: 11,
    MAI: 16,
    METIS: 17,
    metisUSDT: 19,
  },
}

export const STARGATE_CHAIN_ID = {

  ethereum: 101,
  bsc: 102,
  avalanche: 106,
  polygon: 109,
  arbitrum: 110,
  optimism: 111,
  // fantom: 112,
  // metis: 151,
  // base: 184,
  // linea: 183,
  // kava: 177,

}

export const CHAIN_ID: { [ key in Chains ]: number } = {

  arbitrum: 42161,
  polygon: 137,
  optimism: 10,
  ethereum: 1,
  avalanche: 43114,
  bsc: 56,

}