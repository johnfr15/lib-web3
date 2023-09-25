import erc20_abi from "./abis/erc20"
import router_abi from "./abis/router_abi"
import { JsonRpcProvider } from 'ethers';




// Misc
export const MAINNET_PROVIDER = new JsonRpcProvider( "https://polygon-mainnet.infura.io/v3/78581dc93b6d43088baba2bb1606d0c8" ) 
export const TESTNET_PROVIDER = new JsonRpcProvider( "https://polygon-mumbai.infura.io/v3/78581dc93b6d43088baba2bb1606d0c8" )






// ABIS
export const ERC20_ABI = erc20_abi
export const ROUTER_ABI = router_abi





// Addresses
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export const ROUTER_ADDRESS:  { [key: string]: string } = {
  'MAINNET': '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
  'TESTNET': '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
}


export const CHAIN_ID:  { [key: string]: number } = {
  'MAINNET': 137,
  'TESTNET': 80001,
}





// Tokens
export const TOKENS: { [key: string]: any } = {
    'MAINNET': {
        matic: "0x0000000000000000000000000000000000000000",
        weth: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
        usdc:'0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        dai:'0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
        wbtc:'',
        usdt:'0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    },
    'TESTNET': {
        matic: "0x0000000000000000000000000000000000000000",
        weth: '',
        dai: '',
        usdc: '', 
        usdt: '', 
    }
}

export const TICKER: {[key: string]: string} = {

    "0x0000000000000000000000000000000000000000": "MATIC",

    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": "WETH",
    "": "WETH",

    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174": "USDC",
    "": "USDC",

    "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063": "DAI",
    "": "DAI",

    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F": "USDT",
}