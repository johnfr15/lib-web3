import { erc20_abi } from './abis/erc20';
import { mySwap_abi } from './abis/mySwap';
import { Provider, constants, RpcProvider } from 'starknet';





/***********************************|
|            PROVIDERS              |
|__________________________________*/
export const TESTNET_PROVIDER = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } }) // for starknet testnet 1
export const MAINNET_PROVIDER = new RpcProvider({ nodeUrl: "https://starknet-mainnet.infura.io/v3/429467ee5c414c8686b4427c9b3dda16" }) // for starknet mainnet





/***********************************|
|              ABIS                 |
|__________________________________*/
export const MYSWAP_ABI = mySwap_abi
export const ERC20_ABI = erc20_abi





/***********************************|
|            CONTRACTS              |
|__________________________________*/
export const TESTNET_MYSWAP = "0x018a439bcbb1b3535a6145c1dc9bc6366267d923f60a84bd0c7618f33c81d334"
export const MAINNET_MYSWAP = "0x010884171baf1914edc28d7afb619b40a4051cfae78a094a55d230f19e944a28"





/***********************************|
|              TOKENS               |
|__________________________________*/
export const TOKENS: { [key: string]: any } = {
    'MAINNET': {
        eth: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        usdc:'0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
        dai: '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3',
        wbtc:'0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac',
        usdt:'0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
        wsteth:'0x042b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2', 
    },
    'TESTNET': {
        eth: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        dai: '0x03e85bfbb8e2a42b7bead9e88e9a1b19dbccf661471061807292120462396ec9',
        usdc:'0x05a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426', 
        usdt:'0x0386e8d061177f19b3b485c20e31137e6f6bc497cc635ccdfcab96fadf5add6a', 
        wsteth:'0x042b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2', 
        tka: '0x02e2faab2cad8ecdde5e991798673ddcc08983b872304a66e5f99fbb24e14abc',
        tkb: '0x0250a29c8cd4d07a4db0516798fe86225e362439e769c9a0e1640d4a8ec12883',
    }
}





/***********************************|
|              MISC                 |
|__________________________________*/
export const TICKER: {[key: string]: string} = {
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7": "ETH",
    "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7": "ETH",

    "0x42b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2": "wstETH",

    "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8": "USDC",
    "0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426": "USDC",
    "0x5a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426": "USDC",
    "0x05a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426": "USDC",

    "0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3": "DAI",
    "0x03e85bfbb8e2a42b7bead9e88e9a1b19dbccf661471061807292120462396ec9": "DAI",
    "0x3e85bfbb8e2a42b7bead9e88e9a1b19dbccf661471061807292120462396ec9": "DAI",

    "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac": "wBTC",

    "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8": "USDT",
    "0x0386e8d061177f19b3b485c20e31137e6f6bc497cc635ccdfcab96fadf5add6a": "USDT",

    "0x124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49": "LORDS",
}

