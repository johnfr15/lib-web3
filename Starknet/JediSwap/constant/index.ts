import { Provider, constants } from 'starknet';
import erc20_abi from "./abis/erc20"
import router_abi from "./abis/jedi_router_abi"
import factory_abi from "./abis/jedi_factory_abi"
import pair_abi from "./abis/jedi_pair_abi"
import zap_in_abi from "./abis/zap_in_abi"




// Misc
export const TESTNET_PROVIDER = new Provider( { sequencer: { network: constants.NetworkName.SN_GOERLI } }) // for starknet testnet 1
export const MAINNET_PROVIDER = new Provider( { sequencer: { network: constants.NetworkName.SN_MAIN } }) // for starknet mainnet

export const MAX_FEE = BigInt( 0 ); // Devnet
export const MINIMUM_LIQUIDITY = BigInt( 1000 )
export const FEES_NUMERATOR = BigInt( 9970 )
export const FEES_DENOMINATOR = BigInt( 10000 )
export const MAX_UINT256 = BigInt( '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' )
export const STARKNET_CHAIN_ID = {
  'MAINNET': "SN_MAIN",
  'TESTNET': "SN_GOERLI"
}





// ABIS
export const ERC20_ABI = erc20_abi
export const JEDI_ROUTER_ABI = router_abi
export const JEDI_FACTORY_ABI = factory_abi
export const JEDI_PAIR_ABI = pair_abi
export const ZAP_IN_ABI = zap_in_abi





// Addresses
export const FACTORY_ADDRESS: { [key: string]: string } = {
  'MAINNET': '0xdad44c139a476c7a17fc8141e6db680e9abc9f56fe249a105094c44382c2fd',
  'TESTNET': '0x262744f8cea943dadc8823c318eaf24d0110dee2ee8026298f49a3bc58ed74a'
}

export const ROUTER_ADDRESS:  { [key: string]: string } = {
  'MAINNET': '0x41fd22b238fa21cfcf5dd45a8548974d8263b3a531a60388411c5e230f97023',
  'TESTNET': '0x2bcc885342ebbcbcd170ae6cafa8a4bed22bb993479f49806e72d96af94c965',
}

export const ZAP_IN_ADDRESS: { [key: string]: string } = {
  'MAINNET': '0x29a303b928b9391ce797ec27d011d3937054bee783ca7831df792bae00c925c',
  'TESTNET': '0x73e3ccd627283aed4fa3940aa2bdb4d2c702e8e44c99b6851c019222558310f',
}





// Tokens
export const TOKENS: { [key: string]: any } = {
    'MAINNET': {
        eth: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        usdc:'0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
        dai:'0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3',
        wbtc:'0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac',
        usdt:'0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
    },
    'TESTNET': {
        eth: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        dai: '0x03e85bfbb8e2a42b7bead9e88e9a1b19dbccf661471061807292120462396ec9',
        usdc: '0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426', 
        tka: '0x02e2faab2cad8ecdde5e991798673ddcc08983b872304a66e5f99fbb24e14abc',
        tkb: '0x0250a29c8cd4d07a4db0516798fe86225e362439e769c9a0e1640d4a8ec12883',
    }
}

export const TICKER: {[key: string]: string} = {
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7": "ETH",
    "0x42b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2": "wstETH",
    "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8": "USDC",
    "0x005a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426": "USDC",
    "0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3": "DAI",
    "0x03e85bfbb8e2a42b7bead9e88e9a1b19dbccf661471061807292120462396ec9": "DAI",
    "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac": "wBTC",
    "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8": "USDT",
    "0x124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49": "LORDS",
}