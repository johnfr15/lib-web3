import { Contract, Wallet } from "ethers"

export type Token = {
    chainId: number
    address: string
    name: string
    symbol: string
    decimals: number
    logoURI: string
}

export type Pool = {
    tokenA: Token
    tokenB: Token
    pair: string
    reserveA: bigint
    reserveB: bigint
}

export type Trade = {
    tokenFrom: Token
    tokenTo: Token
    pool: Pool
    amountIn: bigint
    amountOut: bigint
    amountInMax: bigint
    amountOutMin: bigint
    path: [string, string]
    to: string,
    priceImpact: number
    slipage: number
    deadline: number
    tradeType: number
    network: 'TESTNET' | 'MAINNET'
}



export enum TradeType {
    EXACT_INPUT,
    EXACT_OUTPUT
}

export type ApproveTx = {
    Erc20: Contract, 
    spender: string, 
    amount: bigint,
    decimals: number
    network: 'TESTNET' | 'MAINNET' 
}

export type SwapTx = {
    signer: Wallet
    trade: Trade
    tokenA: Token
    tokenB: Token
    path: [string, string]
    Router: Contract
}

export type AddLiquidityTx = {
    signer: Wallet
    pool: Pool
    tokenA: Token
    tokenB: Token
    amountADesired: bigint
    amountBDesired: bigint
    amountAMin: bigint
    amountBMin: bigint
    to: string
    deadline: number
    network: 'TESTNET' | 'MAINNET' 
}

export type RemoveLiquidity = {
    tokenA: Token,
    tokenB: Token,
    lp: string,
    balanceLp: any,
    liquidity: bigint,
    amountAMin: bigint,
    amountBMin: bigint,
    to: string,
    deadline: number,
    stable: boolean,
    percent: number,
    network: 'TESTNET' | 'MAINNET' 
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

export type AddLiquidity = {
    tokenA: string
    tokenB: string
    amountADesired: bigint
    amountBDesired: bigint
    amountAMin: bigint
    amountBMin: bigint
    to: string
    deadline: number
}

export type AddLiquidityETH = {
    token: string
    amountTokenDesired: bigint,
    amountTokenMin: bigint,
    amountETHMin: bigint,
    to: string
    deadline: number
}