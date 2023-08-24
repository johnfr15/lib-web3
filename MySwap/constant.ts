import { Provider, constants } from 'starknet';
import { mySwap_abi } from './abis/mySwap';
import { erc20_abi } from './abis/erc20';
import dotenv from "dotenv";

export const TESTNET_PROVIDER = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } }) // for starknet testnet 1
export const MAINNET_PROVIDER = new Provider({ sequencer: { network: constants.NetworkName.SN_MAIN } }) // for starknet mainnet

export const TESTNET_MYSWAP = "0x018a439bcbb1b3535a6145c1dc9bc6366267d923f60a84bd0c7618f33c81d334"
export const MAINNET_MYSWAP = "0x010884171baf1914edc28d7afb619b40a4051cfae78a094a55d230f19e944a28"

export const PRIVATE_KEY = process.env.PRIVATE_KEY!;
export const ACCOUNT_ADDRESS = process.env.ACCOUNT_ADDRESS!;

export const MYSWAP_ABI = mySwap_abi
export const ERC20_ABI = erc20_abi

export const TOKEN = {
    eth: {
        mainnet: "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
        testnet: "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    },
    wsteth: {
        mainnet: "0x42b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2",
        testnet: "0x42b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2",
    },
    usdc: {
        mainnet: "0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
        testnet: "0x5a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426",
    },
    dai: {
        mainnet: "0xda114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3",
        testnet: "0x3e85bfbb8e2a42b7bead9e88e9a1b19dbccf661471061807292120462396ec9",
    },
    wbtc: {
        mainnet: "0x3fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
    },
    usdt: {
        mainnet: "0x68f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
    },
    lords: {
        mainnet: "0x124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49",
    },
}

export const TICKER: {[key: string]: string} = {
    "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7": "ETH",
    "0x42b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2": "wstETH",
    "0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8": "USDC",
    "0x5a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426": "USDC",
    "0xda114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3": "DAI",
    "0x3e85bfbb8e2a42b7bead9e88e9a1b19dbccf661471061807292120462396ec9": "DAI",
    "0x3fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac": "wBTC",
    "0x68f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8": "USDT",
    "0x124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49": "LORDS",
}

export enum Pool_testnet {
    NONE,
    USDC_ETH,
    DAI_ETH,
    USDC_DAI,
    wstETH_ETH,
}
export enum Pool_mainnet {
    NONE,
    ETH_USDC,
    DAI_ETH,
    wBTC_USDC,
    ETH_USDT,
    USDC_USDT,
    DAI_USDC,
    wstETH_ETH,
    LORDS_ETH,
}