import { Provider, constants } from "starknet"
import { erc20_sol_abi } from "./abis/erc20Sol"
import { erc20_stark_abi } from "./abis/erc20Stark"
import { cross_address_abi } from "./abis/crossAddress"

export const TESTNET_PROVIDER = new Provider({ sequencer: { network: constants.NetworkName.SN_GOERLI } }) // for starknet testnet 1
export const MAINNET_PROVIDER = new Provider({ sequencer: { network: constants.NetworkName.SN_MAIN } }) // for starknet mainnet

export const ERC20_SOL_ABI = erc20_sol_abi
export const ERC20_STARK_ABI = erc20_stark_abi
export const CROSS_ADDRESS_ABI = cross_address_abi

export const ORBITER = {
    testnet: "0x6838e53488B9F75894a9fDF9feB509eE22c281dd",
}

export const ORBITER_CHAINID_TO_NETWORKID: { [key: number]: string } = {
    1: '1',         // mainnet
    2: '42161',     // Arbitrum
    3: '1',         // zk
    4: '1',         // starknet
    5: '4',         // rinkeby
    6: '137',       // polygon
    7: '10',        // optimism
    8: '1',         // mainnet
    9: '1',         // loopring
    10: '1088',     // metis
    510: '588',     // metis test
    11: '1',        // dydx
    22: '421611',   // arbitrum test
    33: '4',        // zktest
    44: '5',        // starknet(R)
    66: '80001',    // polygon(R)
    77: '69',       // optimism(K)
    88: '3',        // ropsten
    99: '5',        // loopring(G)
    511: '3',       // dydx(R)
    12: '13',       // ZKSpace mainnet
    512: '133',     // ZKSpace testnet
    15: '56',       // BSC mainnet
    515: '97',      // BSC testnet
    514: '280',     // ZkSync2(G)
    16: '42170',    // nova
    516: '421613',  // nova(G)
    517: '1402',    // po zkevm(G)
}

export const CROSS_ADDRESS: { [key: string]: string } = {
    1: '0xD9D74a29307cc6Fc8BF424ee4217f1A587FBc8Dc',
    2: '0xD9D74a29307cc6Fc8BF424ee4217f1A587FBc8Dc',
    3: '',
    4: '',
    5: '0x783703C20dF627893952d59DF40f556A172d1719',
    6: '',
    7: '',
    8: '',
    9: '',
    22: '0x721fBB2C2C9cdFa5547feE6b683949c20F175457',
    33: '',
    44: '',
    66: '0x40eC19690ebEd534e9b9C58e341727028cF143c0',
    77: '0x2200a79aDdFE2EFd7bDe34300f4C8FE902E31d39',
    88: '',
    99: '',
}

export const NETWORK_NAME_TO_ORBITERID: { [key: string]: any } = {
    mainnet: 
    {
        'arbitrum': 2,
        'starknet': 4,
        'polygon': 6,
    },
    testnet:
    {
        'arbitrum': 22,
        'starknet': 44,
        'polygon': 66,
    },
}

export const NETWORK_NAME_TO_ID: { [key: string]: any } = {
    mainnet: 
    {
        'ethereum': 1,
        'arbitrum': 42161,
        'zk': 1,
        'starknet': 1,
        'rinkeby': 4,      
        'polygon': 137,    
        'optimism': 10,      
        'loopring': 1,       
        'metis': 1088,
        'dydx': 1,
        'zkspace': 13,
        'bsc': 56,
        'zksync2': 280,
        'nova': 87,
        'zkevm': 1402,
    },
    testnet: {
        'metis-testnet': 588,
        'arbitrum': 421613,
        'zk': 4,
        'starknet': 5,
        'polygon': 80001,
        'optimism-kovan': 69,
        'ropsten': 3,
        'loopring': 5,
        'dydx': 3,
        'zkspace': 13,
        'bsc': 97,
        'nova': 42170,
    }
}

export const TOKEN: any = {
    eth: 
    {
        starknet: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
        arbitrum: "0x0000000000000000000000000000000000000000",
        polygon: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    },
}

export const TICKER: {[key: string]: string} = {
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7": "ETH",
    "0x0000000000000000000000000000000000000000": "ETH",
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": "ETH",
}

