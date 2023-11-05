import erc20_abi from "./abis/erc20"
import pool_v3_abi from "./abis/pool_v3"
import { SwapOptions } from "../types/swap"
import quoter_v2_abi from "./abis/quoter_v2"
import factory_v3_abi from "./abis/factory_v3"
import swap_router_abi from "./abis/swap_router"
import { RemoveOptions, AddOptions, Fees, TradeType } from "../types"
import non_fungible_manager_abi from "./abis/non_fungible_manager"





/***********************************|
|              ABIS                 |
|__________________________________*/
export const ERC20_ABI = erc20_abi
export const SWAP_ROUTER_ABI = swap_router_abi
export const QUOTER_V2_ABI = quoter_v2_abi
export const FACTORY_V3_ABI = factory_v3_abi
export const POOL_ABI = pool_v3_abi
export const NFT_MANAGER_ABI = non_fungible_manager_abi





/***********************************|
|             CONTRACTS             |
|__________________________________*/
// see https://docs.baseswap.fi/baseswap/info/smart-contracts
export const CONTRACTS: { [ key: string]: string } = {
  
  BSWAP: '0x78a087d713Be963Bf307b18F2Ff8122EF9A63ae9',
  BSX: '0xd5046b976188eb40f6de40fb527f89c05b323385',
  xBSX: '0xe4750593d1fc8e74b31549212899a72162f315fa',
  ARX: '0x58ed4fd0c3d930b674ba50a293f03ef6cd7de7a3',
  MASTERCHEF: '0x6Fc0f134a1F20976377b259687b1C15a5d422B47',
  FACTORY: '0xFDa619b6d20975be80A10332cD39b9a4b0FAa8BB',
  ROUTER: '0x327Df1E6de05895d2ab08513aaDD9313Fe505d86' ,
  OLD_MASTERCHEF: '0x2B0A43DCcBD7d42c18F6A83F86D1a19fA58d541A',
  FACTORY_V3: '0x38015D05f4fEC8AFe15D7cc0386a126574e8077B' ,
  SWAP_ROUTER_V3: '0x1B8eea9315bE495187D873DA7773a874545D9D48' ,
  NFT_MANAGER: '0xDe151D5c92BfAA288Db4B67c21CD55d5826bCc93',

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
  tradeType: TradeType.EXACT_INPUT,
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

export const MAX_TICK = 887272
export const MIN_TICK = -887272
export const MAX_UINT128 = "0xffffffffffffffffffffffffffffffff";
export const MAX_UINT256 = "0xffffffffffffffffffffffffffffffffff";

export const BEST_FEE_POOL: { [key: string]: Fees } = {

  WETH_USDC: Fees.LOW,
  WETH_DAI: Fees.MEDIUM,

  USDC_WETH: Fees.MEDIUM,
  USDC_DAI: Fees.VERY_LOW,

  DAI_WETH: Fees.MEDIUM,
  DAI_USDC: Fees.VERY_LOW,

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