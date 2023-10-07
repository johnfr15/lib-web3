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

  ethereum: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    dai: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },

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
  
  optimism: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0x4200000000000000000000000000000000000006",
    dai: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    usdc: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    usdt: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  },


  bsc: {
    bnb: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    dai: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
    usdc: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    usdt: '0x55d398326f99059fF775485246999027B3197955',
  },

  avalanche: {
    avax: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
    usdc: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    usdt: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
    dai: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
  },




  avalancheTestnet: {
    avax: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth: '0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f',
    dai: '0xC9D26E47883271ff70182f4266C18fb454FE1B43',
    usdc:'0xA4C930EbD593197226CEc2Cbdc6927bcF405338C',
    usdt:'0x9a01bf917477dD9F5D715D188618fc8B7350cd22',
  },

  ethereumTestnet: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth9: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    dai: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
    usdc:'0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557',
    usdt:'0x509Ee0d083DdF8AC028f2a56731412edD63223B9',
  },

  polygonTestnet: {
    matic: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    wmatic: "0x5B67676a984807a212b1c59eBFc9B3568a474F0a",
    weth: '0x714550C2C1Ea08688607D86ed8EeF4f5E4F22323',
    usdc:'0x742DfA5Aa70a8212857966D491D67B09Ce7D6ec7',
    usdt:'0x3813e82e6f7098b9583FC0F33a962D02018B6803',
    dai:'0xcB1e72786A6eb3b44C2a2429e317c8a2462CFeb1',
  },

  arbitrumTestnet: {
    eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    weth: '0xEe01c0CD76354C383B8c7B4e65EA88D00B06f36f',
    usdc:'0x179522635726710Dd7D2035a81d856de4Aa7836c',
    usdt:'0xE742da76701dc9BB348EB931959DD42B9DF04Ff6',
    dai: '0x02668f5a60D637D21e39689B68B675ed4A7B696d',
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