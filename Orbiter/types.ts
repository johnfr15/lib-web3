import { Provider, Contract as StarkContract, Account } from "starknet"
import { JsonRpcProvider, BaseContract as SolContract, BigNumberish, Wallet } from "ethers"

export type BridgeToken = {
    provider: JsonRpcProvider | Provider
    chainId: number // The tokens on different chains are different, but the names are the same
    name: string
    address: string
    precision: number
    makerAddress: string
    contract: StarkContract | SolContract
    icon?: string
}

export type BridgeChain = {
    id: number // Orbiter's chainId
    name: string
    networkId: number | string
    icon?: string
}

export type OrbiterToken = 'ETH' | 'USDC' | 'DAI' | 'USDT'

export type BridgeNetwork = 'Mainnet' | 'Testnet'

export type Maker = {
    makerAddress: string,
    sender: string,
    maxPrice: number,
    minPrice: number,
    tradingFee: number,
    gasFee: number,
    fromPrecision: number,
    toPrecision: number,
    startTime: number,
    endTime: number,
}
export type MarkerType = {
    makerAddress: string,
    sender: string,
    fromChainId: number,
    toChainId: number,
    fromChainName: string,
    toChainName: string,
    fromTokenAddress: string,
    // toTokenAddress: string,
    tokenName: string,
    fromPrecision: number,
    toPrecision: number,
    maxPrice: string,
    minPrice: string,
    tradingFee: string,
    gasFee: number,
    startTime: number,
    endTime: number
}

export type Chains = 'starknet' | 'arbitrum' | 'polygon' | 'ethereum' | 'zksync' | 'optimism' | 'metis' | 'boba' |
                     'zksync2' | 'bsc' | 'arbitrum_nova' | 'polygon_zkevm' | 'base' | 'linea' | 'mantle'

export type ChainType = {
    api: Object
    chainId: string,
    networkId: string,
    internalId: string,
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

export type TxTransferArgs = {
    evmSigner: Wallet
    starkSigner: Account
    token: BridgeToken
    amount: bigint
    fromChain: BridgeChain
    toChain: BridgeChain
    maker: MarkerType
    network: 'TESTNET' | 'MAINNET'
    
    defaultGasLimit?: BigNumberish  // For evm, default value is 55000
    fromAddress?: string
    decimals?: number               // For immutableX, docs: https://docs.x.immutable.com/docs/linktransfer
    symbol?: string                 // For immutableX
    memo?: string                   // For loopring
    receiverPublicKey?: string      // For dydx, docs: https://docs.dydx.exchange/#create-transfer
    receiverPositionId?: string     // For dydx
    clientIdAddress?: string        // For dydx, default is toAddress
    nonce?: number                  // For customize
    maxFee?: BigNumberish
    
    crossAddressExt?: CrossAddressExt // Cross address transfer data
}

export type CrossAddressExt = {
    type: string
    value: string
}

export const CrossAddressExtTypes = {
'0x01': 'Cross Ethereum Address',
'0x02': 'Cross Dydx Address',
'0x03': 'Cross Stark Address',
}

export type ApproveCallData = {
    contractAddress: string,
    entrypoint: string,
    calldata: [ string, bigint ] 
}

export type CrossTransferCalldata = {
    contractAddress: string,
    entrypoint: string,
    calldata: [ string, string, bigint, string ] 
}