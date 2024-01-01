import { Chains, SwapOptions, AddOptions, RemoveOptions } from "../types"
import erc20_abi from "./abis/erc20"
import swap_router_abi from "./abis/swap_router"
import quoter_v2_abi from "./abis/quoter_v2"
import factory_v3_abi from "./abis/factory_v3"
import pool_v3_abi from "./abis/pool_v3"
import non_fungible_manager_abi from "./abis/non_fungible_manager"







/***********************************|
|              ABIS                 |
|__________________________________*/
export const ERC20_ABI = erc20_abi
export const SWAP_ROUTER_ABI = swap_router_abi
export const QUOTER_V2_ABI = quoter_v2_abi
export const FACTORY_ABI = factory_v3_abi
export const POOL_ABI = pool_v3_abi
export const NFT_MANAGER_ABI = non_fungible_manager_abi





/***********************************|
|             CONTRACTS             |
|__________________________________*/
export const NATIVE_TOKEN = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

export const SWAP_ROUTER : { [key in Chains]: any } = {
  ethereum: "0x1b81D678ffb9C0263b24A97847620C99d213eB14",
  arbitrum: "0x1b81D678ffb9C0263b24A97847620C99d213eB14",
  zkevm: "0x1b81D678ffb9C0263b24A97847620C99d213eB14",
  bsc: "0x1b81D678ffb9C0263b24A97847620C99d213eB14",
  linea: '0x1b81D678ffb9C0263b24A97847620C99d213eB14',
  base: '0x1b81D678ffb9C0263b24A97847620C99d213eB14',
  zksync: '0xD70C70AD87aa8D45b8D59600342FB3AEe76E3c68', 

  arbitrumTestnet: '0x1b81D678ffb9C0263b24A97847620C99d213eB14',
  ethereumTestnet: '0x1b81D678ffb9C0263b24A97847620C99d213eB14', 
  bscTestnet: '0x1b81D678ffb9C0263b24A97847620C99d213eB14',
  zkevmTestnet: '0x1b81D678ffb9C0263b24A97847620C99d213eB14',
  zkSyncTestnet: '',
}

export const QUOTER_V2 : { [key in Chains]: any } = {
  ethereum: "0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997",
  arbitrum: "0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997",
  zkevm: "0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997",
  bsc: "0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997",
  linea: '0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997',
  base: '0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997',
  zksync: '0x3d146FcE6c1006857750cBe8aF44f76a28041CCc', 

  arbitrumTestnet: '0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2',
  ethereumTestnet: '0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2', 
  bscTestnet: '0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2',
  zkevmTestnet: '0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2',
  zkSyncTestnet: '',
}

export const FACTORY : { [key in Chains]: any } = {
  ethereum: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
  arbitrum: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
  zkevm: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
  bsc: "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
  linea: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
  base: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
  zksync: '0x1BB72E0CbbEA93c08f535fc7856E0338D7F7a8aB', 

  arbitrumTestnet: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
  ethereumTestnet: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865', 
  bscTestnet: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
  zkevmTestnet: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
  zkSyncTestnet: '',
}

export const NFT_MANAGER : { [key in Chains]: any } = {
  ethereum: "0x46A15B0b27311cedF172AB29E4f4766fbE7F4364",
  arbitrum: "0x46A15B0b27311cedF172AB29E4f4766fbE7F4364",
  zkevm: "0x46A15B0b27311cedF172AB29E4f4766fbE7F4364",
  bsc: "0x46A15B0b27311cedF172AB29E4f4766fbE7F4364",
  linea: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
  base: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
  zksync: '0xa815e2eD7f7d5B0c49fda367F249232a1B9D2883', 

  arbitrumTestnet: '0x427bF5b37357632377eCbEC9de3626C71A5396c1',
  ethereumTestnet: '0x427bF5b37357632377eCbEC9de3626C71A5396c1', 
  bscTestnet: '0x427bF5b37357632377eCbEC9de3626C71A5396c1',
  zkevmTestnet: '0x427bF5b37357632377eCbEC9de3626C71A5396c1',
  zkSyncTestnet: '',
}




/***********************************|
|              TOKENS               |
|__________________________________*/
export const TOKENS: { [key in Chains]: any } = {


  ethereum: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },

  arbitrum: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    usdc:'0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    dai:'0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    usdt:'0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  },

  bsc: {
    bnb: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    weth: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
    dai: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
    usdc: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    usdt: '0x55d398326f99059fF775485246999027B3197955',
  },

  zkevm: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9",
    usdc:'0xA8CE8aee21bC2A48a5EF670afCc9274C7bbbC035',
    dai:'0xC5015b9d9161Dca7e18e32f6f25C4aD850731Fd4',
    usdt:'0x1E4a5963aBFD975d8c9021ce480b42188849D41d',
  },

  linea: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f",
    usdc:'0x176211869ca2b568f2a7d4ee941e073a821ee1ff',
    dai:'0x4af15ec2a0bd43db75dd04e62faa3b8ef36b00d5',
    usdt:'0xa219439258ca9da29e9cc4ce5596924745e12b93',
  },

  base: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0x4200000000000000000000000000000000000006",
    usdc:'0xEB466342C4d449BC9f53A865D5Cb90586f405215',
    dai:'0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    usdt:'',
  },

  zksync: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91",
    usdc:'0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4',
    dai:'',
    usdt:'0x493257fD37EDB34451f62EDf8D2a0C418852bA4C',
  },





  ethereumTestnet: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    dai: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
    usdc:'0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557',
    usdt:'0x509Ee0d083DdF8AC028f2a56731412edD63223B9',
  },

  arbitrumTestnet: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth: '0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f',
    usdc:'0x179522635726710Dd7D2035a81d856de4Aa7836c',
    usdt:'0xE742da76701dc9BB348EB931959DD42B9DF04Ff6',
    dai: '0x02668f5a60D637D21e39689B68B675ed4A7B696d',
  },


  bscTestnet: {
    bnb: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    wbnb: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    weth: '',
    usdc:'',
    usdt:'0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
    dai: '',
  },
  zkSyncTestnet: {
    
  },
  zkevmTestnet: {},
}





/***********************************|
|              MISC                 |
|__________________________________*/
export const MAX_TICK = 887272
export const MIN_TICK = -887272
export const MAX_UINT128 = "0xffffffffffffffffffffffffffffffff";

export const DEFAULT_OPTION: SwapOptions = {
  slipage: 0.5, // 0.5% of slipage tolerance
  deadline: Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
}

export const DEFAULT_ADD_OPTION: AddOptions = {
  max: false,
  slipage: 0.5, // 0.5% of slipage tolerance
  deadline: Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
  tokenId: undefined
}

export const DEFAULT_REMOVE_OPTION: RemoveOptions = {
  slipage: 0.5, // 0.5% of slipage tolerance
  deadline: Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
  percent: 100,
  tokenId: undefined
}





/***********************************|
|              CHAINS               |
|__________________________________*/
export const CHAIN_ID: { [ key in Chains ]: number } = {

  ethereum: 1,
  arbitrum: 42161,
  bsc: 56,
  zkevm: 1101,
  linea: 59144,
  base: 8453,
  zksync: 324, 

  ethereumTestnet: 5,
  arbitrumTestnet: 421613,
  bscTestnet: 97,
  zkSyncTestnet: 280,
  zkevmTestnet: 1442,
}

export const CHAIN_ID_TO_NAME: { [ key: number ]: Chains } = {

  1: "ethereum", 
  42161: "arbitrum",
  56: "bsc",
  1101: "zkevm",
  59144: "linea",
  8453: "base",
  324: "zksync", 

  5: "ethereumTestnet",
  421613: "arbitrumTestnet",
  97: "bscTestnet",
  280: "zkSyncTestnet",
  1442: "zkevmTestnet",
}