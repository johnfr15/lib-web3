import erc20_abi from "./abis/erc20"
import router_abi from "./abis/mute_router_abi"
import factory_abi from "./abis/mute_factory_abi"
import pair_abi from "./abis/mute_pair_abi"
import { JsonRpcProvider } from 'ethers';




// Misc
export const MAINNET_PROVIDER = new JsonRpcProvider( "https://mainnet.era.zksync.io" ) 
export const TESTNET_PROVIDER = new JsonRpcProvider( "https://testnet.era.zksync.dev" )






// ABIS
export const ERC20_ABI = erc20_abi
export const MUTE_ROUTER_ABI = router_abi
export const MUTE_FACTORY_ABI = factory_abi
export const MUTE_PAIR_ABI = pair_abi





// Addresses
export const FACTORY_ADDRESS: { [key: string]: string } = {
  'MAINNET': '0x40be1cba6c5b47cdf9da7f963b6f761f4c60627d',
  'TESTNET': '0xCc05E242b4A82f813a895111bCa072c8BBbA4a0e'
}

export const ROUTER_ADDRESS:  { [key: string]: string } = {
  'MAINNET': '0x8B791913eB07C32779a16750e3868aA8495F5964',
  'TESTNET': '0x96c2Cf9edbEA24ce659EfBC9a6e3942b7895b5e8',
}

export const MULTI_CALL:  { [key: string]: string } = {
  'MAINNET': '0xb1F9b5FCD56122CdfD7086e017ec63E50dC075e7',
  'TESTNET': '0xd9Ee4c1e04059D4B0dd02b747282511bEE4E5fB5',
}





// Tokens
export const TOKENS: { [key: string]: any } = {
    'MAINNET': {
        eth: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
        usdc:'',
        dai:'',
        wbtc:'',
        usdt:'',
    },
    'TESTNET': {
        eth: '0x294cB514815CAEd9557e6bAA2947d6Cf0733f014',
        dai: '',
        usdc: '', 
        tka: '',
        tkb: '',
    }
}

export const TICKER: {[key: string]: string} = {
    "0x294cB514815CAEd9557e6bAA2947d6Cf0733f014": "ETH",
    "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91": "ETH",
    "": "wstETH",
    "": "USDC",
    "": "USDC",
    "": "DAI",
    "": "DAI",
    "": "wBTC",
    "": "USDT",
    "": "LORDS",
}