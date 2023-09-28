import { JsonRpcProvider } from 'ethers';
import erc20_abi from "./abis/erc20"
import v2_router_abi from "./abis/v2_router_abi"
import v3_factory_abi from "./abis/v3_factory_abi"
import v3_pool_abi from "./abis/v3_pool_abi"
import quoter from "./abis/quoter"
import universal_router_abi from "./abis/universal_router"



// Misc
export const PROVIDER: {[key: string]: string} = {
  "MAINNET": "https://polygon-mainnet.infura.io/v3/78581dc93b6d43088baba2bb1606d0c8",
  "TESTNET": "https://polygon-mumbai.infura.io/v3/78581dc93b6d43088baba2bb1606d0c8",
}

export const MAINNET_PROVIDER = new JsonRpcProvider( PROVIDER[ 'MAINNET' ] ) 
export const TESTNET_PROVIDER = new JsonRpcProvider( PROVIDER[ 'TESTNET' ] )






// ABIS
export const ERC20_ABI = erc20_abi
export const UNIVERSAL_ROUTER_ABI = universal_router_abi
export const V2_ROUTER_ABI = v2_router_abi
export const V3_FACTORY_ABI = v3_factory_abi
export const V3_POOL_ABI = v3_pool_abi
export const QUOTER_ABI = quoter





// Addresses
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export const V3_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'
export const UNIVERSAL_ROUTER = '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD'
export const V3_FACTORY = "0x1f98431c8ad98523631ae4a59f267346ea31f984"
export const QUOTER = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"



export const WMATIC: { [key: string | number]: string } = {
  'MAINNET': "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  'TESTNET': "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889"
}

export const CHAIN_ID:  { [key: string]: number } = {
  'MAINNET': 137,
  'TESTNET': 80001,
}



// Uniswap
/// @dev Used as a flag for identifying the transfer of ETH instead of a token
export const ETH = "0x0000000000000000000000000000000000000000";
/// @dev Used as a flag for identifying that msg.sender should be used, saves gas by sending more 0 bytes
export const MSG_SENDER = "0x0000000000000000000000000000000000000001";
/// @dev Used as a flag for identifying address(this) should be used, saves gas by sending more 0 bytes
export const ADDRESS_THIS = "0x0000000000000000000000000000000000000002";



// Tokens
export const TOKENS: { [key: string]: any } = {
    'MAINNET': {
        matic: "0x0000000000000000000000000000000000000000",
        wmatic: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        weth: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        usdc:'0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        dai:'0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        usdt:'0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    },
    'TESTNET': {
        matic: "0x0000000000000000000000000000000000000000",
        wmatic: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
        weth: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
        dai: '0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253',
        usdc: '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747', 
        usdt: '0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832', 
    }
}

export const TICKER: {[key: string]: string} = {

    "0x0000000000000000000000000000000000000000": "MATIC",

    "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270": "WMATIC",
    "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889": "WMATIC",

    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": "WETH",
    "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa": "WETH",

    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174": "USDC",
    "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747": "USDC",

    "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063": "DAI",
    "0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253": "DAI",

    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F": "USDT",
    "0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832": "USDT",
}

