import { AddressLike } from "ethers"

// gas-price
export type GasPrice = {
    chainId: number,
    txType: number,
    fast: { gasPrice: string, estimatedSeconds: number },
    normal: { gasPrice: string, estimatedSeconds: number },
    slow: { gasPrice: string, estimatedSeconds: number }
}

// token-price
export type TokenPrice = {
    chainId: number,
    tokenAddress: AddressLike,
    tokenPrice: number,
    decimals: number,
    currency: string
}

// build-tx
export type Route = {
    // Address of the sender.
    sender: AddressLike
    // Address of the recipient.
    recipient: AddressLike
    // Source ChainId
    fromChainId: number
    // Destination ChainId
    toChainId: number
    // Address of the source token
    fromTokenAddress: AddressLike
    // Address of the destination token
    toTokenAddress: AddressLike
    // Amount as Bignumber for the source token
    fromAmount: number
    // Amount as Bignumber for the destination token
    toAmount: number
}

export type RouteOptions = {
    // Path returned in the userTx with type fund-movr
    // Example 1-10 === from mainnet to optimism 
    routePath?: string 
    // Token Address that is being sent to the bridge. In case of swap, the token that you swapped into has to be passed here.
    bridgeInputTokenAddress?: AddressLike
    // Boolean variable that notifies us if refuel(dropping some native tokens on the destination chain) also has to be included in the transaction.
    bridgeWithGas?: bigint
    // Override the default swap slippage sent by the quote. If not passed default is assumed.
    swapSlippage?: number
    // Override the default bridge slippage sent by the quote. NOTE - Slippage is not present for all bridges.
    bridgeSlippage?: number
    // Destination Payload
    destinationPayload?: string
    // Destination Gas limit
    destinationGasLimit?: bigint
    // BridgeInsuranceAmount
    bridgeInsuranceAmount?: bigint
    // Fee Percentage - Percentage of fee to be cut from the input token. Supports only three decimal places and uptp 5 percent.
    feePercent?: number
    // Fee Taker Address - Address that collects the fee.
    feeTakerAddress?: AddressLike
}

export type RouteTx = {
    userTxType: string,
    txTarget: AddressLike,
    chainId: number,
    txData: string,
    txType: string,
    value: bigint,
    totalUserTx: number,
    approvalData: {
      minimumApprovalAmount: bigint,
      approvalTokenAddress: AddressLike,
      allowanceTarget: AddressLike,
      owner: AddressLike
    }
}

export type BridgeStatusOptions = {
    // Name of the bridge used while bridging.
    bridgeName?: string
    // Is the transaction a bridge protection transaction.
    isBridgeProtectionTx?: boolean
}

export type BridgeStatus = {
    sourceTx: string,
    sourceTxStatus: 'READY' | 'PENDING' | 'COMPLETED' | 'FAILED',
    destinationTransactionHash: string,
    destinationTxStatus: 'READY' | 'PENDING' | 'COMPLETED' | 'FAILED',
    fromChainId: 1,
    toChainId: 137
}