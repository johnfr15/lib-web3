import { Wallet, Contract } from "ethers"

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

export type Chains = 'arbitrum' | 'polygon' | 'optimism' | 'ethereum' | 'avalanche' | 'bsc'

// functions params

export type BridgeOptions = {
    max?: boolean
    network?: 'MAINNET' | 'TESTNET'
    slipage?: number
}

export type BridgeTx = {
    signer: Wallet
    SushiXSwapV2: Contract
    tokenIn: Token
    fromChain: Chains
    toChain: Chains
    bridge: Bridge               // The arguments to be passed for function "bridge"
    stp: StargateTeleportParams  // The arguments used by "StargatAdapter" contract when using "swap" function of stargateRouter
    feesCost: bigint             // Fees needed for executing code on target chain
}

export type ApproveTx = {
    signer: Wallet
    Erc20: Contract, 
    spender: string, 
    amount: bigint,
    token: Token
    network: 'TESTNET' | 'MAINNET' 
}

// SUSHI X SWAP

export type BridgeParams = {
    refId: string       
    adapter: string      
    tokenIn: string     // Token's address to bridge
    amountIn: bigint
    to: string          // receiver address on the other chain
    adapterData: string // StargateTeleportParams encoded 
}

export type Bridge = {
    bridgeParams: string         // BridgeParams encoded
    refundAddress: string        // Should be the signer's address. The contract will send back the gas remaining
    swapPayload: string          // (optional) types of all the arguments in 'payloadData'
    payloadData: string          // (optional) extra arguments for the target chain contract
}



// STARGATE

export type StargateTeleportParams = {
    dstChainId: number  // stargate dst chain id
    token: string       // token getting bridged
    srcPoolId: bigint   // stargate src pool id
    dstPoolId: bigint   // stargate dst pool id
    amount: bigint      // amount to bridge
    amountMin: bigint   // amount to bridge minimum
    dustAmount: bigint  // native token to be received on dst chain
    receiver: string    // detination address for sgReceive
    to: string          // address for fallback tranfers on sgReceive
    gas: bigint         // extra gas to be sent for dst chain operations
}