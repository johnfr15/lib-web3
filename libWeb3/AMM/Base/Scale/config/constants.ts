import pool_abi from "./abis/pool"
import erc20_abi from "./abis/erc20"
import router_abi from "./abis/router"
import factory_abi from "./abis/factory"
import { AddOptions } from "../types/add"
import { SwapOptions } from "../types/swap"
import { RemoveOptions } from "../types/remove"





/***********************************|
|              ABIS                 |
|__________________________________*/
export const ERC20_ABI = erc20_abi
export const POOL_ABI = pool_abi
export const FACTORY_ABI = factory_abi
export const ROUTER_ABI = router_abi





/***********************************|
|             CONTRACTS             |
|__________________________________*/
export const CONTRACTS: { [ key: string ]: string } = {
  
  SCALE: '0x54016a4848a38f257b6e96331f7404073fd9c32c',
  PairFactory: '0xed8db60acc29e14bc867a497d94ca6e3ceb5ec04',
  Router: '0x2F87Bf58D5A9b2eFadE55Cdbd46153a0902be6FA',
  VotingEscrow: '0x28c9c71c776a1203000b56c0cca48bef1cd51c53',
  GaugeFactory: '0xb136b45e3e241bb0d0c037395446cf42e4db13d6',
  BribeFactory: '0xcb418f555974ef099a528c2c866b35520230ae18',
  Voter: '0x46abb88ae1f2a35ea559925d99fdc5441b592687',
  Minter: '0xf241f4fbe146a075424beadac2d2a743ad31fb8d',

}





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

export const MAX_UINT128 = "0xffffffffffffffffffffffffffffffff";
export const MAX_UINT256 = "0xffffffffffffffffffffffffffffffffff";

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