import pool_abi from "./abis/pool"
import erc20_abi from "./abis/erc20"
import router_abi from "./abis/router"
import factory_abi from "./abis/factory"
import poolFees_abi from "./abis/poolFees"
import { RemoveOptions, AddOptions } from "../types"
import { SwapOptions } from "../types/swap"





/***********************************|
|              ABIS                 |
|__________________________________*/
export const POOL_ABI = pool_abi
export const ERC20_ABI = erc20_abi
export const ROUTER_ABI = router_abi
export const FACTORY_ABI = factory_abi
export const POOLFEES_ABI = poolFees_abi





/***********************************|
|             CONTRACTS             |
|__________________________________*/
// see https://aerodrome.finance/security#contracts
export const CONTRACTS: { [ key: string]: string } = {
  
  AERO: '0x940181a94A35A4569E4529A3CDfB74e38FD98631',
  AirdropDistributor: '0xE4c69af018B2EA9e575026c0472B6531A2bC382F',
  ArtProxy: '0xE9992487b2EE03b7a91241695A58E0ef3654643E',
  FactoryRegistry: '0x5C3F18F06CC09CA1910767A34a20F771039E37C0',
  Forwarder: '0x15e62707FCA7352fbE35F51a8D6b0F8066A05DCc',
  GaugeFactory: '0x35f35cA5B132CaDf2916BaB57639128eAC5bbcb5',
  ManagedRewardsFactory: '0xFdA1fb5A2a5B23638C7017950506a36dcFD2bDC3',
  Minter: '0xeB018363F0a9Af8f91F06FEe6613a751b2A33FE5',
  PoolFactory: '0x420DD381b31aEf6683db6B902084cB0FFECe40Da',
  RewardsDistributor: '0x227f65131A261548b057215bB1D5Ab2997964C7d',
  Router: '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43',
  Voter: '0x16613524e02ad97eDfeF371bC883F2F5d6C480A5',
  VotingEscrow: '0xeBf418Fe2512e7E6bd9b87a8F0f294aCDC67e6B4',
  VotingRewardsFactory: '0x45cA74858C579E717ee29A86042E0d53B252B504',

}

export const DEFAULT_FACTORY = "0x420DD381b31aEf6683db6B902084cB0FFECe40Da"





/***********************************|
|              TOKENS               |
|__________________________________*/
export const NATIVE_TOKEN = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

export const TOKENS = {

  eth: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  weth9: '0x4200000000000000000000000000000000000006',
  usdc:'0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  dai: "0x50c5725949a6f0c72e6c4a641f24049a917db0cb",
  wbtc: undefined,
  usdt: undefined,

}





/***********************************|
|              MISC                 |
|__________________________________*/
export const DEFAULT_SWAP_OPTION: SwapOptions = {
  max: false,
  slipage: 0.5, // 0.5% of slipage tolerance
  deadline: Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
}

export const DEFAULT_ADD_OPTION: AddOptions = {
  max: false,
  slipage: 0.5, // 0.5% of slipage tolerance
  deadline: Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
}

export const DEFAULT_REMOVE_OPTION: RemoveOptions = {
  slipage: 0.5, // 0.5% of slipage tolerance
  deadline: Math.floor( Date.now() / 1000 ) + 60 * 20, // 20 minutes from the current Unix time
  percent: 100, // 100% of the pool
}

export const POOL_STABLE: { [key: string]: boolean } = {

  WETH_USDC: false,
  WETH_DAI: false,

  USDC_WETH: false,
  USDC_DAI: true,

  DAI_WETH: false,
  DAI_USDC: true,

}



/***********************************|
|              CHAINS               |
|__________________________________*/
export const CHAIN_ID: { [ key: string ]: number } = {

  'bsc': 56,
  'aurora': 1313161554,
  'arbitrum': 42161,
  'polygon': 137,
  'meter': 82,
  'zksync': 324,
  'ontology': 58,
  'mantle': 5000,
  'linea': 59144,
  'ethereumClassic': 61,
  'base': 8453,
  'opbnb': 204,
  'kroma': 255,
  'manta': 169,
  'scroll': 169,
  'bscTestnet': 97,
  'zksyncTestnet': 280,
  'scrollTestnet': 534351,
  'mantleTestnet': 5001,
  'lineaTestnet': 59140

}

export const CHAIN_ID_TO_NAME: { [ key: number ]: string } = {

  56: 'bsc',
  1313161554: 'aurora',
  42161: 'arbitrum',
  137: 'polygon',
  82: 'meter',
  324: 'zksync',
  58: 'ontology',
  5000: 'mantle',
  59144: 'linea',
  61: 'ethereumClassic',
  8453: 'base',
  204: 'opbnb',
  255: 'kroma',
  169: 'manta',
  169.1: 'scroll',
  97: 'bscTestnet',
  280: 'zksyncTestnet',
  534351: 'scrollTestnet',
  5001: 'mantleTestnet',
  59140: 'lineaTestnet',

}