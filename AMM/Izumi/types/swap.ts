import { Wallet, Contract } from "ethers"
import { Token, Pool, Chains, Fees } from "."


export type SwapOptions = {
    tradeType: TradeType
    percent?: number  // A number: 0.00 < percent <= 100.00
    max?: boolean
    slipage?: number
    deadline?: number
    fee?: Fees
}

export type Trade = {
    tokenIn: Token
    tokenOut: Token
    path: string[]
    pathEncoded: string
    amountIn: bigint
    amountOut: bigint
    amountInMax: bigint | undefined
    amountOutMin: bigint | undefined
    priceImpact: number
    sqrtPriceLimitX96: bigint
    to: string
    pool: Pool
    slipage: number
    deadline: number
    chain: Chains
    tradeType: TradeType
}

export enum TradeType {
    EXACT_INPUT,
    EXACT_OUTPUT
}

export type SwapTx = {
    signer: Wallet
    trade: Trade
    Swap: Contract
}

// Quoter
export type SwapAmountParams = {
    path: string
    recipient: string
    amount: bigint
    minAcquired: bigint
    deadline: number
}

export type SwapDesireParams = {
    path: string
    recipient: string
    desire: bigint
    maxPayed: bigint
    deadline: number
}