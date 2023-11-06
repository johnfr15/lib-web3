import { Wallet, Contract } from "ethers"
import { Token, Pool, TradeType } from "."


export type SwapOptions = {
    tradeType?: TradeType 
    percent?: number  // A number: 0.00 < percent <= 100.00
    max?: boolean
    slipage?: number
    deadline?: number
}

export type Trade = {
    tokenIn: Token
    tokenOut: Token
    path: string[]
    amountIn: bigint
    amountOut: bigint
    amountInMax: bigint
    amountOutMin: bigint
    priceImpact: number
    to: string
    pool: Pool
    slipage: number
    deadline: number
}

export type SwapTx = {
    signer: Wallet
    trade: Trade
    Router: Contract
    options: SwapOptions
}

export type SwapExactETHForTokens = {
    amountOutMin: bigint
    path: string[]
    to: string
    deadline: number
}

export type SwapETHForExactTokens = {
    amountOut: bigint
    path: string[]
    to: string
    deadline: number
}

export type SwapExactTokensForETH = {
    amountIn: bigint
    amountOutMin: bigint
    path: string[]
    to: string
    deadline: number
}

export type SwapTokensForExactETH = {
    amountOut: bigint
    amountInMax: bigint
    path: string[]
    to: string
    deadline: number
}

export type SwapExactTokensForTokens = {
    amountIn: bigint
    amountOutMin: bigint
    path: string[]
    to: string
    deadline: number
}

export type SwapTokensForExactTokens = {
    amountOut: bigint
    amountInMax: bigint
    path: string[]
    to: string
    deadline: number
}