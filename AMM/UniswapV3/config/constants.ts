import { Chains, Fees, Options, RemoveOptions } from "../types"
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

export const SWAP_ROUTER : { [key: string]: any } = {
  ethereum: "0x2E6cd2d30aa43f40aa81619ff4b6E0a41479B13F",
  arbitrum: "0x8A21F6768C1f8075791D08546Dadf6daA0bE820c", // Nova
  optimism: "0x8c32Fd078B89Eccb06B40289A539D84A4aA9FDA6",
  polygon: "0x0aF89E1620b96170e2a9D0b68fEebb767eD044c3",
  polygonZkEVM: "0xc14Ee6B248787847527e11b8d7Cf257b212f7a9F",
  bsc: "0x909662a99605382dB1E8d69cc1f182bb577d9038",
  avalanche: "0x8E4638eefee96732C56291fBF48bBB98725c6b31",
  
  // base: "",
  // boba: "",
  // core: "",
  // fantom: "",
  // fuse: "",
  // gnosis: "",
  // moonBeam: "",
  // moonRiver: "",
  // thunderCore: "",
}

export const QUOTER_V2 : { [key: string]: any } = {
  ethereum: "0x64e8802FE490fa7cc61d3463958199161Bb608A7",
  arbitrum: "0x0524E833cCD057e4d7A296e3aaAb9f7675964Ce1", // Nova
  optimism: "0xb1E835Dc2785b52265711e17fCCb0fd018226a6e",
  polygon: "0xb1E835Dc2785b52265711e17fCCb0fd018226a6e",
  polygonZkEVM: "0xb1E835Dc2785b52265711e17fCCb0fd018226a6e",
  avalanche: "0xb1E835Dc2785b52265711e17fCCb0fd018226a6e",
  bsc: "0xb1E835Dc2785b52265711e17fCCb0fd018226a6e",
}

export const FACTORY : { [key: string]: any } = {
  ethereum: "0xbACEB8eC6b9355Dfc0269C18bac9d6E2Bdc29C4F",
  arbitrum: "0xaa26771d497814E81D305c511Efbb3ceD90BF5bd", // Nova
  optimism: "0x9c6522117e2ed1fE5bdb72bb0eD5E3f2bdE7DBe0",
  polygon: "0x917933899c6a5F8E37F31E19f92CdBFF7e8FF0e2",
  polygonZkEVM: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
  avalanche: "0x3e603C14aF37EBdaD31709C4f848Fc6aD5BEc715",
  bsc: "0x126555dd55a39328F69400d6aE4F782Bd4C34ABb",
}

export const NFT_MANAGER : { [key: string]: any } = {
  ethereum: "0x2214A42d8e2A1d20635c2cb0664422c528B6A432",
  arbitrum: "0x258f7E97149afd7D7F84fa63b10e4A3f0C38B788", // Nova
  optimism: "0x1af415a1EbA07a4986a52B6f2e7dE7003D82231e",
  polygon: "0xb7402ee99F0A008e461098AC3A27F4957Df89a40",
  polygonZkEVM: "0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3",
  avalanche: "0x18350b048AB366ed601fFDbC669110Ecb36016f3",
  bsc: "0xF70c086618dcf2b1A461311275e00D6B722ef914",
}




// Tokens
export const TOKENS: { [key in Chains]: any } = {

  polygon: {
    matic: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    weth: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    usdc:'0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    dai:'0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    usdt:'0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  },

  arbitrum: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    usdc:'0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    dai:'0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    usdt:'0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  },
  
  optimism: {},

  ethereum: {},

  avalanche: {},

  bsc: {},


  ethereumTestnet: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    dai: '0x73967c6a0904aA032C103b4104747E88c566B1A2',
    weth: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    sgeth: '0xCf1F9cD3789Fc6296f4abB11dc460067Ae1a2673',
    usdc:'0xDf0360Ad8C5ccf25095Aa97ee5F2785c8d848620',
    usdt:'0x5BCc22abEC37337630C0E0dd41D64fd86CaeE951',
  },

  avalancheTestnet: {
    avax: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth: '',
    dai: '0x12C135a68b7B3Cd006eDb785cB53398a5DA59613',
    usdc:'0x4A0D1092E9df255cf95D72834Ea9255132782318',
    usdt:'0x134Dc38AE8C853D1aa2103d5047591acDAA16682',
  },

  polygonTestnet: {
    matic: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    usdc:'0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7',
    usdt:'0x6Fc340be8e378c2fF56476409eF48dA9a3B781a0',
    wmatic: "0x5B67676a984807a212b1c59eBFc9B3568a474F0a",
    weth: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
    dai:'0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253',
  },

  arbitrumTestnet: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    sgeth: "0xb45186E02CC4AbC0e390EdFfdc2aBC8D523ea15e",
    weth: '',
    usdc:'0x6aAd876244E7A1Ad44Ec4824Ce813729E5B6C291',
    usdt:'0x533046F316590C19d99c74eE661c6d541b64471C',
  },
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
  polygon: 137,
  avalanche: 43114,
  optimism: 10,
  bsc: 56,

  ethereumTestnet: 5,
  arbitrumTestnet: 421613,
  polygonTestnet: 80001,
  avalancheTestnet: 43113,
}

export const CHAIN_ID_TO_NAME: { [ key: number ]: Chains } = {

  1: "ethereum", 
  42161: "arbitrum",
  137: "polygon", 
  43114: "avalanche",
  10: "optimism",
  56: "bsc",

  5: "ethereumTestnet",
  421613: "arbitrumTestnet",
  80001: "polygonTestnet",
  43113: "avalancheTestnet",
}