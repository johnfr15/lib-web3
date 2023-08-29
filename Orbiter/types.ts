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

export type BridgeNetwork = 'Mainnet' | 'Testnet'

export type MarkerType = {
    makerAddress: string,
    fromChainId: number,
    toChainId: number,
    fromChainName: string,
    toChainName: string,
    fromTokenAddress: string,
    toTokenAddress: string,
    tokenName: string,
    minPrice: string,
    maxPrice: string,
    precision: number,
    avalibleDeposit: string,
    tradingFee: string,
    gasFee: number,
    avalibleTimes: Array<{ startTime: number, endTime: number }>,
}

export type Chains = 'starknet' | 'arbitrum' | 'polygon'

export type ChainType = {
    name: string,
    orbiterId: number,
    chainId: number,
    shortName: string,
    networkId: number,
    nativeCurrency: {
        name: string,
        symbol: string,
        decimals: number,
    },
    rpc: Array<string>
    faucets: Array<string>,
    explorers: Array<string>,
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
    network: 'testnet' | 'mainnet'
    
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
'0x02': 'Cross Stark Address',
}