import { Wallet, AddressLike } from "ethers"
import { Quote, UserTx } from "./api/quote"

export type Token = {
    chainId: number
    address: string
    name: string
    symbol: string
    decimals: number
    logoURI: string
}

export type ChainType = {
    api: Object
    chainId: string,
    networkId: string,
    stargateId: string,
    name: string,
    debug: boolean,
    nativeCurrency: {
        name: string,
        symbol: string,
        decimals: number,
        address: string,
    },
    rpc: Array<string>
    contracts: string[]
    tokens: Array<Object>
    xvmList: Array<string>
    infoURL: string,
}

export type Chains = 'arbitrum' | 'polygon' | 'optimism' | 'ethereum' | 'avalanche' | 'bsc' | 'base' | 'aurora' | 'fantom' | 'gnosis' | 'zksync' | 'zkevm'

// functions params

export type BridgeOptions = {
    max?: boolean
    slipage?: number
    sort?: 'output' | 'gas' | 'time'
    uniqueRoutesPerBridge?: boolean
    securityBridges?: 1 | 2 | 3 | 4 | 5
}

export type BridgeTx = {
    signer: Wallet
    fromToken: Token
    toToken: Token
    fromChain: Chains
    toChain: Chains
    amount: bigint
    quote: Quote
    userTx: UserTx
    routeTx: {
        userTxType: string,
        txType: string,
        txData: string,
        txTarget: AddressLike,
        chainId: number,
        userTxIndex: number,
        value: string, // Hexadecimal bigint
        approvalData: {
            minimumApprovalAmount: bigint,
            approvalTokenAddress: AddressLike,
            allowanceTarget: AddressLike,
            owner: AddressLike
        }
    }
}

export type ApproveTx = {
    signer: Wallet,
    data: string,
    to: AddressLike,
    from: AddressLike,
}