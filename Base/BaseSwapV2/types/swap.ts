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
    amountOutMin: bigint
    priceImpact: number
    to: string
    pool: Pool
    route: Route
    slipage: number
    deadline: number
}

export type Route = {
    from: string
    to: string
    stable: boolean
    factory: string
}

export type SwapTx = {
    signer: Wallet
    trade: Trade
    Router: Contract
    options: SwapOptions
}

export type SwapExactETHForTokens = {
    amountOutMin: bigint
    routes: Route[],
    to: string
    deadline: number
}

export type SwapExactTokensForETH = {
    amountIn: bigint
    amountOutMin: bigint
    routes: Route[],
    to: string
    deadline: number
}

export type SwapExactTokensForTokens = {
    amountIn: bigint
    amountOutMin: bigint
    routes: Route[],
    to: string
    deadline: number
}