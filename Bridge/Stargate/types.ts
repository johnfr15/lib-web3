import { Wallet, Contract } from "ethers"

export type Token = {
    chainId: number
    address: string
    name: string
    symbol: string
    decimals: number
    logoURI: string
}

export enum FUNCTION_TYPE {
    ZERO,
    SWAP_REMOTE,
    ADD_LIQUIDITY,         
    REDEEM_LOCAL_CALL_BACK,
    WITHDRAW_REMOTE,
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

export type Chains = 'arbitrum' | 'polygon' | 'optimism' | 'ethereum' | 'avalanche' | 'bsc' | 'polygonTestnet' | 'arbitrumTestnet' |
                     'avalancheTestnet' | 'ethereumTestnet'

// functions params

export type BridgeOptions = {
    max?: boolean
    slipage?: number
}

export type BridgeTx = {
    signer: Wallet
    Router: Contract
    payload: StargateParams
    messageFee: bigint        // Fees needed to pay for the cross chain message fee
    utils: {
        native: Token
        tokenIn: Token
        fromChain: Chains
        toChain: Chains
    }
}

export type ApproveTx = {
    signer: Wallet
    Erc20: Contract, 
    spender: string, 
    amount: bigint,
    token: Token
}



export type StargateParams = {
    dstChainId: number    // stargate dst chain id
    srcPoolId: bigint     // stargate src pool id
    dstPoolId: bigint     // stargate dst pool id
    refundAddress: string // Address to receive the remaining gas
    amount: bigint        // amount to bridge
    amountMin: bigint     // amount to bridge minimum
    lzTxParams: {
        dstGasForCall: number 
        dstNativeAmount: number
        dstNativeAddr: string // Encoded address
    }
    to: string            // Encoded address for fallback tranfers on sgReceive
    payload: string       // Encoded data for payloas
}