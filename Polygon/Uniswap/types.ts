import { Contract, ethers, Wallet } from "ethers"
import { Token, Trade, Percent, JSBI } from "@uniswap/sdk"



export type ApproveTx = {
    Erc20: Contract, 
    spender: string, 
    amount: bigint,
    decimals: number
    network: 'TESTNET' | 'MAINNET' 
}

export type SwapTx = {
    signer: Wallet
    Router: Contract
    trade: Trade
    path: [string, string]
    slipage: Percent
    deadline: number
    network: 'TESTNET' | 'MAINNET' 
}

export type AddLiquidity = {
    tokenA: Token
    tokenB: Token
    amountADesired: bigint
    amountBDesired: bigint
    amountAMin: bigint
    amountBMin: bigint
    to: string
    deadline: number
    feeType: number
    stable: boolean
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
    amountOutMin: JSBI
    path: string[] 
    to: string
    deadline: number
}

export type SwapETHForExactTokens = {
    amountOut: JSBI
    path: string[] 
    to: string
    deadline: number
}

export type SwapExactTokensForETH = {
    amountIn: JSBI
    amountOutMin: JSBI 
    path: string[] 
    to: string
    deadline: number
}

export type SwapTokensForExactETH = {
    amountOut: JSBI
    amountInMax: JSBI 
    path: string[] 
    to: string
    deadline: number
}

export type SwapExactTokensForTokens = {
    amountIn: JSBI
    amountOutMin: JSBI 
    path: string[] 
    to: string
    deadline: number
}

export type SwapTokensForExactTokens = {
    amountOut: JSBI
    amountInMax: JSBI 
    path: string[] 
    to: string
    deadline: number
}