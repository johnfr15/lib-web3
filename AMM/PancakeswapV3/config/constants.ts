import { Chains, Options, RemoveOptions } from "../types"
import erc20_abi from "./abis/erc20"
import swap_router_abi from "./abis/swap_router"
import quoter_v2_abi from "./abis/quoter_v2"
import factory_v3_abi from "./abis/factory_v3"
import pool_v3_abi from "./abis/pool_v3"
import non_fungible_manager_abi from "./abis/non_fungible_manager"







// ABIS
export const ERC20_ABI = erc20_abi
export const SWAP_ROUTER_ABI = swap_router_abi
export const QUOTER_V2_ABI = quoter_v2_abi
export const FACTORY_ABI = factory_v3_abi
export const POOL_ABI = pool_v3_abi
export const NFT_MANAGER_ABI = non_fungible_manager_abi





// ADDRESSES
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




// Tokens
export const TOKENS: { [key in Chains]: any } = {

  ethereum: {},
  zkevm: {},
  bsc: {},
  linea: {},
  base: {},
  zksync: {},

  arbitrum: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    usdc:'0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    dai:'0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    usdt:'0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  },




  ethereumTestnet: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    dai: '0x73967c6a0904aA032C103b4104747E88c566B1A2',
    weth: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    sgeth: '0xCf1F9cD3789Fc6296f4abB11dc460067Ae1a2673',
    usdc:'0xDf0360Ad8C5ccf25095Aa97ee5F2785c8d848620',
    usdt:'0x5BCc22abEC37337630C0E0dd41D64fd86CaeE951',
  },

  arbitrumTestnet: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    sgeth: "0xb45186E02CC4AbC0e390EdFfdc2aBC8D523ea15e",
    weth: '',
    usdc:'0x6aAd876244E7A1Ad44Ec4824Ce813729E5B6C291',
    usdt:'0x533046F316590C19d99c74eE661c6d541b64471C',
  },

  bscTestnet: {},
  zkSyncTestnet: {},
  zkevmTestnet: {},
}

// Misc

export const MAX_TICK = 887272
export const MIN_TICK = -887272
export const MAX_UINT128 = "0xffffffffffffffffffffffffffffffff";

export const DEFAULT_OPTION: Options = {
  max: false,
  slipage: 0.5, // 0.5% of slipage tolerance
  deadline: Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
}

export const DEFAULT_ADD_OPTION: RemoveOptions = {
  max: false,
  slipage: 0.5, // 0.5% of slipage tolerance
  deadline: Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
  tokenId: undefined
}

export const DEFAULT_REMOVE_OPTION: RemoveOptions = {
  max: false,
  slipage: 0.5, // 0.5% of slipage tolerance
  deadline: Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
  percent: 100,
  tokenId: undefined
}



// Chains

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