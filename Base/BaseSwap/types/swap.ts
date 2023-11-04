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
    path: [string, string]
    amountIn: bigint
    amountOut: bigint
    amountInMax: bigint | undefined
    amountOutMin: bigint | undefined
    sqrtPriceLimitX96: bigint
    to: string
    priceImpact: number
    pool: Pool
    slipage: number
    deadline: number
    tradeType: number
}

export type Position = {
    tokenId: number
    nonce: bigint
    operator: string
    token0: string
    token1: string
    fee: number
    tickLower: number
    tickUpper: number
    liquidity: bigint
    feeGrowthInside0LastX128: bigint
    feeGrowthInside1LastX128: bigint
    tokensOwed0: bigint
    tokensOwed1: bigint
}

export type ExactInput = {
    path: string
    recipient: string
    deadline: number
    amountIn: bigint
    amountOutMinimum: bigint
}

export type ExactOutput = {
    path: string
    recipient: string
    deadline: number
    amountOut: bigint
    amountInMaximum: bigint
}

export type ExactInputSingle = {
    tokenIn: string
    tokenOut: string
    fee: number
    recipient: string
    deadline: number
    amountIn: bigint
    amountOutMinimum: bigint
    sqrtPriceLimitX96: bigint
}

export type ExactOutputSingle = {
    tokenIn: string
    tokenOut: string
    fee: number
    recipient: string
    deadline: number
    amountOut: bigint
    amountInMaximum: bigint
    sqrtPriceLimitX96: bigint
}